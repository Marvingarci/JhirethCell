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
use App\Models\User;
use App\Models\Product;
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
            'usuarios'=> User::all(['id','first_name','last_name']),
            'ventas_dia' => new VentaCollection(
                Auth::user()->account->ventas()
                    ->orderBy('created_at')
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
            'usuarios'=> User::all(['id','first_name','last_name']),
            'producto'=> DB::table('products')->where('product_code',Request::only('search', 'trashed'))->first(),
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
        Auth::user()->account->ventas()->create($request->validated());
        $last = Ventas::latest('id')->first();
        $registro = Ventas::find($last);
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
            }else if($venta['category_id'] == 1){
                $venta['garantia'] = 'No aplica';
                $venta['fin_garantia'] = $hoy;
            }

            $ven = VentaDetalle::create([
                'ventas_id'=>$last->id, 
                'product_id' => $venta['id'], 
                'product_code' => $venta['product_code'],
                'producto'=> $venta['name'], 
                'cantidad'=>$venta['cantidad'], 
                'precio'=> $venta['sell_price'], 
                'descuento'=>$venta['descuento'], 
                'total_producto'=>$venta['total_producto'], 
                'estado' => $request->tipoPago,
                'garantia' => $venta['garantia'],
                'fin_garantia' => $venta['fin_garantia']

            ]);

            foreach ($productos as $producto) {
                if($venta['id'] == $producto->id){
                    $producto->existencia = $producto->existencia - $venta['cantidad'];
                    $producto->update();
                }
            }
        }
        if($request->tipoPago == 'pendiente'){
            return Redirect::back()->with('success', 'Venta rapida agregada.');

        }else{
            return Redirect::route('ventas')->with('success', 'Venta agregada.');
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
            'venta' => Ventas::with('venta_detalles')->where('id',$id)->get(),
            'usuarios'=> User::all(['id','first_name','last_name']),
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
        $venta->update($request->validated());

        $venta_detalle = VentaDetalle::find($request->venta_detalles['id']);
        $venta_detalle->estado = 'efectivo';
        $venta_detalle->save();
        // foreach ($ventas as $vent) {
        //     $ven = VentaDetalle::create([
        //         'ventas_id'=>$last->id, 'producto'=> $venta['name'], 'cantidad'=>$venta['cantidad'], 'precio'=> $venta['sell_price'], 'descuento'=>$venta['descuento'], 'total_producto'=>$venta['total_producto'], 'estado' => $request->tipoPago
        //     ]);
           
        // }
        return Redirect::back()->with('success', 'Venta Editada.');
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
        $venta_detalle = VentaDetalle::find($request->venta_detalles['id']);
        $productos = Product::all();

        foreach ($productos as $producto) {
            if($producto->id == $venta_detalle['product_id']){
                $producto->existencia = $producto->existencia + $venta_detalle['cantidad'];
                $producto->update();
            }
        }

        $venta->delete();
      

        return Redirect::back()->with('success', ' borrado.');
    }
}
