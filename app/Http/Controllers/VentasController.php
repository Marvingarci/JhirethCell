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
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class VentasController extends Controller
{
   
   public function index()
    {
        return Inertia::render('Sells/Index', [
            'filters' => Request::all('search', 'trashed'),
            'usuarios'=> User::all(['id','first_name','last_name', 'organization_id']),
            'ventas_dia' => new VentaCollection(
                Ventas::
                    orderBy('created_at', 'desc')
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
        $hoy = Carbon::now();
        $productos = Product::all();
        $request['restante'] = $request['total'];
        $registro = Ventas::create($request->validated());
        $registro->fecha_efectiva = $hoy;
        
        if($registro->tipoPago == 'credito'){
            $registro->limite_pago = Carbon::now()->addDays($registro->dias_credito); 
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
                'precio'=> $venta['sell_price'], 
                'descuento'=>$venta['descuento'], 
                'total_producto'=>$venta['total_producto'], 
                'costo_servicio'=>$venta['costo_servicio'], 
                'estado' => $request->tipoPago,
                'garantia' => $venta['garantia'],
                'fin_garantia' => $venta['fin_garantia']

            ]);

            if($venta['category_id'] != 4){
                if($venta['dbType'] == 'colectivo' ){
                    // Bajar el inventario a productos colectivos
                    $inve = Inventario::where('codebar', $venta['codebar'])->first();
                    $inve->existencia = $inve->existencia - $venta['cantidad'] ;
                    $inve->save();
                }else{
                    if($request->tipoPago == 'efectivo' || $request->tipoPago == 'credito'){
                        $inventario = Inventario::where('codebar', $venta['codebar'])->update(['status' => 'vendido']);
                    }else {
                        $inventario = Inventario::where('codebar', $venta['codebar'])->update(['status' => 'pendiente']);
                    }
                }
            }

            

            // foreach ($productos as $producto) {
            //     if($venta['id'] == $producto->id){
            //         $producto->existencia = $producto->existencia - $venta['cantidad'];
            //         $producto->update();
            //     }
            // }
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
            'venta' => Ventas::with(['venta_detalles','pagos'])->where('id',$id)->get(),
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
        $venta = Ventas::find($request['id']);
        $venta->tipoPago = 'efectivo';
        $venta->fecha_efectiva = Carbon::now();
        $venta->update();

        $ventas = $request['venta_detalles'];

        //Inventario::where('codebar', $request->venta_detalles['product_code'])->update(['status' => 'vendido']);
        foreach ($ventas as $v) {
            $venta_detalle = VentaDetalle::find($v["id"]);
            $venta_detalle->estado = 'efectivo';
            $venta_detalle->update();
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
        $venta = Ventas::find($request['id']);
        $ventaAEliminar = Ventas::where('id',$request['id'])->with('venta_detalles')->first();

        //$venta_detalle = VentaDetalle::find($request->venta_detalles['id']);
        switch ($request['razonDev']) {
            case 'buena':
                    $producto = Product::find($request->venta_detalles['product_id']);
                    if($producto['dbType'] == 'colectivo'){
                        // Bajar el inventario a productos colectivos
                        $inve = Inventario::where('codebar', $request->venta_detalles['product_code'])->first();
                        $inve->existencia = $inve->existencia + $request->venta_detalles['cantidad'];
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
      
        if($request['razonDev'] == 'eliminacion'){
            return Redirect::route('ventas')->with('success', 'Exito');
        }else{
            return Redirect::back()->with('success', 'Exito');
        }
    }

    public function deleteItem(HttpRequest $request)
    {
        
        
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
                $inve->save();
            }else{
                Inventario::where('codebar', $ventaDetalleToDelete['product_code'])->update(['status' => 'stock']);
            }
        }
        
        $ventaDetalleToDelete->delete();


        return Redirect::back()->with('success', 'Articulo eliminado de Venta');
    }
}
