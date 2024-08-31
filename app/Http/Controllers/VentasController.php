<?php

namespace App\Http\Controllers;

use App\Models\Ventas;
use App\Models\VentaDetalle;
use Illuminate\Http\Request as HttpRequest;
use App\Http\Requests\VentaStoreRequest;
use App\Http\Requests\VentaUpdateRequest;
use App\Http\Resources\VentaCollection;
use App\Http\Resources\ProductResource;
use Inertia\Inertia;
use App\Models\Organization;
use App\Models\Category;
use App\Models\Contact;
use App\Models\Inventario;
use App\Models\User;
use App\Models\Product;
use App\Models\Servicios;
use App\Models\Payment;
use App\Models\Registro;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Http\Controllers\RegistroController;

class VentasController extends Controller
{
   
   public function index()
    {
        $user = Auth::user();
        return Inertia::render('Sells/Index', [
            'filters' => Request::all('search', 'trashed'),
            'usuarios'=> User::all(['id','first_name','last_name', 'organization_id']), 
            'ventas_dia' => new VentaCollection(
                Ventas::
                    orderBy('created_at', 'desc')
                    ->where('organization_id', $user->organization_id)
                    ->filter(Request::only('search', 'trashed'))
                    ->paginate()
                    ->appends(Request::all())
            ),
        ]);
    }

  

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return Inertia::render('Sells/Create', [
            'filters' => Request::all('search', 'trashed'),
        'categorias' => Category::all(),
            'servicios' => Servicios::all(),
            'usuarios'=> User::with('organization')->get(),
            'contactos'=> Contact::all(['id','first_name','last_name', 'organization_id']),
            'producto'=> Inventario::where('codebar',Request::only('search', 'trashed'))->with('product')->first(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(VentaStoreRequest $request)
    {


        DB::beginTransaction();
        try {
            $hoy = Carbon::now();
        $productos = Product::all();
        $request['restante'] = $request['total'];
        $registro = Ventas::create($request->validated());
        $registro->fecha_efectiva = $hoy;
        
        if($registro->tipoPago == 'credito'){
            $registro->limite_pago = Carbon::now()->addDays($registro->dias_credito); 
        }

        if($registro->tipoPago == 'multiple'){
            $pagos = $request->payments;
            foreach ($pagos as $pay) {
                $newpayment = Payment::create(['ventas_id' => $registro->id, 'vendedor_id' => $pay['vendedor_id'], 'cantidad' => $pay['cantidad'], 'concepto' => $pay['concepto'], 'comentario' => '']);
                $newpayment->save();
            }
        }



        $registro->save();

         
        $ventas = $request->ventas;
        foreach ($ventas as $venta) {
            if($venta['category_id'] == 2){
                $venta['garantia'] = '60 dias';
                $hoyEn60 = $hoy->add(60, 'day');
                $venta['fin_garantia'] = $hoyEn60;
            }else if($venta['category_id'] == 1){
                $venta['garantia'] = '30 dias';
                $hoyEn30 = $hoy->add(30, 'day');
                $venta['fin_garantia'] = $hoyEn30;
            }else{
                $venta['garantia'] = 'No aplica';
                $venta['fin_garantia'] = $hoy;
            }

            $ven = VentaDetalle::create([
                'ventas_id'=>$registro->id, 
                'product_id' => $venta['id'], 
                'product_code' => $venta['codebar'],
                'category_id' => $venta['category_id'], 
                'producto'=> $venta['name'], 
                'cantidad'=>$venta['cantidad'], 
                'precio'=> $venta['real_sell_price'], 
                'descuento'=>$venta['descuento'], 
                'total_producto'=>$venta['total_producto'], 
                'costo_servicio'=>$venta['costo_servicio'], 
                'estado' => $request->tipoPago,
                'garantia' => $venta['garantia'],
                'fin_garantia' => $venta['fin_garantia']

            ]);

            if($venta['category_id'] != 4){
                if($venta['dbType'] == 'colectivo' ){
                    $inve = Inventario::where('codebar', $venta['codebar'])->first();
                    $inve->existencia = $inve->existencia - $venta['cantidad'] ;
                    $organizations = $inve->existenciaDividida == null ? [] : json_decode($inve->existenciaDividida);
                    if(count($organizations) > 0){
                        foreach ($organizations as $orga) {
                            if($orga->organization_id == $request['organization_id']){
                                $orga->cantidad -= $venta['cantidad'];
                            }
                        }   

                        $inve->existenciaDividida = json_encode($organizations);
                    }
                    $inve->save();
                }else{
                    if($request->tipoPago == 'efectivo' || $request->tipoPago == 'credito'){
                        $inventario = Inventario::where('codebar', $venta['codebar'])->update(['status' => 'vendido']);
                    }else {
                        $inventario = Inventario::where('codebar', $venta['codebar'])->update(['status' => 'pendiente']);
                    }
                }
            }
        }


        RegistroController::logNewVenta($registro, $ventas);

        DB::commit();

        }catch (\Exception $e) {
            DB::rollBack();
            dd($e->getMessage());

            return back()->withErrors(['error' => 'Order failed. Please try again.']);
        }


        if($request->tipoPago == 'pendiente'){
            return Redirect::back()->with('success', 'Venta rapida agregada.');

        }else{
            return Redirect::route('ventas.edit', $registro->id)->with('success', 'Venta agregada.');
        }
    }

 

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        return Inertia::render('Sells/Edit', [
            'venta' => Ventas::with(['venta_detalles','pagos'])->where('id',$id)->first(),
            'vendedores'=> User::all(['id','first_name','last_name']),
            'categorias'=> Category::All()
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function update(VentaUpdateRequest $request)
    {
        DB::beginTransaction();

        try{
            $venta = Ventas::find($request['id']);
            $venta->tipoPago = 'efectivo';
            $venta->fecha_efectiva = Carbon::now();
            $venta->update();
    
            $ventas = $request['venta_detalles'];
    
            foreach ($ventas as $v) {
                $venta_detalle = VentaDetalle::find($v["id"]);
                $venta_detalle->estado = 'efectivo';
                $venta_detalle->update();
            }

            $inventoriesIds = array_reduce($ventas, function ($carry, $item) {
                $carry[] = $item['product_code'];
                return $carry;
            }, []);

            $productsIds = array_reduce($ventas, function ($carry, $item) {
                $carry[] = $item['product_id'];
                return $carry;
            }, []);
            
            $registroLog = Registro::create([
                'user_id' => $venta->vendedor_id,
                'organization_id' => $venta->organization_id,
                'module' => 'Ventas',
                'venta_id' => $venta->id,
                'inventario_id' =>$inventoriesIds,
                'product_id' => $productsIds,
                'action' => 'Venta convertida a efectivo',
                'description' => 'El usuario '.Auth::user()->first_name.' '.Auth::user()->last_name.' convirtio la venta #'.$venta->id.' a efectivo.',
                'note' => ''
            ]);

            DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();
            dd($e->getMessage());

            return back()->withErrors(['error' => 'Order failed. Please try again.']);
        }
        
        return Redirect::route('ventas')->with('success', 'Venta convertida a efectivo.');
    }
    public function updateFast(VentaUpdateRequest $request)
    {
        $venta = Ventas::find($request['id']);
        $venta->tipoPago = 'efectivo';
        $venta->fecha_efectiva = Carbon::now();
        $venta->update();

        $ventas = $request['venta_detalles'];

        $producto = Product::find($ventas['product_id']);
        if($producto['dbType'] == 'individual'){
            Inventario::where('codebar', $ventas['product_code'])->update(['status' => 'vendido']);
        }

        
            $venta_detalle = VentaDetalle::find($ventas["id"]);
            $venta_detalle->estado = 'efectivo';
            $venta_detalle->update();
        

        
        return Redirect::back()->with('success', 'Venta efectiva');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function destroy(HttpRequest $request)
    {   


        DB::beginTransaction();

        try {

        $venta = Ventas::find($request['id']);
        $ventaAEliminar = Ventas::where('id',$request['id'])->with('venta_detalles')->first();

        switch ($request['razonDev']) {
            case 'buena':
                    $producto = Product::find($request->venta_detalles['product_id']);
                    if($producto['dbType'] == 'colectivo'){
                        // Bajar el inventario a productos colectivos
                        $inve = Inventario::where('codebar', $request->venta_detalles['product_code'])->first();
                        $inve->existencia = $inve->existencia + $request->venta_detalles['cantidad'];
                        $organizations = $inve->existenciaDividida == null ? [] : json_decode($inve->existenciaDividida);
                        if(count($organizations) > 0){
                            foreach ($organizations as $orga) {
                                if($orga->organization_id == $venta['organization_id']){
                                    $orga->cantidad += $request->venta_detalles['cantidad'];
                                }
                            }   
                            $inve->existenciaDividida = json_encode($organizations);
                        }
                        $inve->save();
                    }else{
                        Inventario::where('codebar', $request->venta_detalles['product_code'])->update(['status' => 'stock']);
                    }
                break;
            case 'mala':
                $producto = Product::find($request->venta_detalles['product_id']);
                if($producto['dbType'] == 'colectivo'){
                    // No se hace nada cuando es colectivo y esta mala
                }else{
                    Inventario::where('codebar', $request->venta_detalles['product_code'])->update(['status' => 'mala']);
                }
                break;
            case 'observacion':
                $producto = Product::find($request->venta_detalles['product_id']);
                if($producto['dbType'] == 'colectivo'){
                    // No se hace nada cuando es colectivo y esta en observacion
           
                }else{
                    Inventario::where('codebar', $request->venta_detalles['product_code'])->update(['status' => 'observacion']);
                }
                break;
            case 'eliminacion':
                // esto pasa cuando se elimina una venta completa y se pasan los productos a stock nuevamente
                foreach ($ventaAEliminar->venta_detalles as $v) {
                    $producto = Product::find($v->product_id);
                    if($v['category_id'] != 4){
                        if($producto['dbType'] == 'colectivo'){
                            // Bajar el inventario a productos colectivos
                            $inve = Inventario::where('codebar', $v['product_code'])->first();
                            $inve->existencia = $inve->existencia + $v['cantidad'] ;
                            $organizations = $inve->existenciaDividida == null ? [] : json_decode($inve->existenciaDividida);
                            if(count($organizations) > 0){
                                foreach ($organizations as $orga) {
                                    if($orga->organization_id == $ventaAEliminar->organization_id){
                                        $orga->cantidad += $v['cantidad'];
                                    }
                                }   
                                $inve->existenciaDividida = json_encode($organizations);
                            }
                            $inve->save();
                        }else{
                            Inventario::where('codebar', $v['product_code'])->update(['status' => 'stock']);
                        }
                    }
                }   
                break;
            
            default:
                # code...
                break;
        }
     

        $venta->delete();

        RegistroController::logDeleteVenta($venta, $ventaAEliminar->venta_detalles);

        DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();
            dd($e->getMessage());

            return back()->withErrors(['error' => 'Order failed. Please try again.']);
        }
      
        if($request['razonDev'] == 'eliminacion'){
            return Redirect::route('ventas')->with('success', 'Exito');
        }else{
            return Redirect::back()->with('success', 'Exito');
        }
    }

    public function deleteItem(HttpRequest $request)
    {
        
        DB::beginTransaction();
        try{
            $ventaDetalleToDelete = VentaDetalle::find($request['product_id']);
            $venta = Ventas::find($request['venta_id']);
    
            if(isset($ventaDetalleToDelete)){
                $venta->total = $venta->total - $ventaDetalleToDelete->total_producto;
                $venta->save();
            }
    
            $producto = Product::find($ventaDetalleToDelete->product_id);
            if($ventaDetalleToDelete['category_id'] != 4){
                if($producto['dbType'] == 'colectivo'){
                    // Bajar el inventario a productos colectivos
                    $inve = Inventario::where('codebar', $ventaDetalleToDelete['product_code'])->first();
                    $inve->existencia = $inve->existencia + $ventaDetalleToDelete['cantidad'] ;
                    $organizations = $inve->existenciaDividida == null ? [] : json_decode($inve->existenciaDividida);
                    if(count($organizations) > 0){
                        foreach ($organizations as $orga) {
                            if($orga->organization_id == $venta['organization_id']){
                                $orga->cantidad += $ventaDetalleToDelete['cantidad'];
                            }
                        }   
    
                        $inve->existenciaDividida = json_encode($organizations);
                    }
                    $inve->save();
                }else{
                    Inventario::where('codebar', $ventaDetalleToDelete['product_code'])->update(['status' => 'stock']);
                }
            }
            
            $ventaDetalleToDelete->delete();

            $log = 'El usuario '.Auth::user()->first_name.' '.Auth::user()->last_name.' elimino el producto '.$ventaDetalleToDelete['producto'].' de la venta #'.$venta->id.' => '.$venta->tipoPago.
            ($venta->tipoPago == 'credito' ? ' a '.$venta->dias_credito.' dias.' : '');

            $existencia = RegistroController::getExistenciaEnTexto($ventaDetalleToDelete['product_id'], $ventaDetalleToDelete['producto']);

            $registroLog = Registro::create([
                'user_id' => $venta->vendedor_id,
                'organization_id' => $venta->organization_id,
                'module' => 'Ventas',
                'venta_id' => $venta->id,
                'inventario_id' =>[$ventaDetalleToDelete['product_code']],
                'product_id' => [$ventaDetalleToDelete['product_id']],
                'action' => 'Eliminar Producto de Venta',
                'description' => $log,
                'note' => $existencia
            ]);

            DB::commit();

        }catch (\Exception $e) {
            DB::rollBack();
            dd($e->getMessage());

            return back()->withErrors(['error' => 'Order failed. Please try again.']);
        }

        return Redirect::back()->with('success', 'Articulo eliminado de Venta');
    }
}
