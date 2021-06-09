<?php

namespace App\Http\Controllers;

use App\Models\Ventas;
use App\Models\VentaDetalle;
use Illuminate\Http\Request as HttpRequest;
use App\Http\Requests\VentaStoreRequest;
use App\Http\Requests\ProductUpdateRequest;
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
     

        Auth::user()->account->ventas()->create($request->validated());
        $last = Ventas::latest('id')->first();
        $registro = Ventas::find($last);
        $ventas = $request->ventas;
        foreach ($ventas as $venta) {
            $ven = VentaDetalle::create([
                'venta_id'=>$last->id, 'producto'=> $venta['name'], 'cantidad'=>$venta['cantidad'], 'precio'=> $venta['sell_price'], 'descuento'=>'0', 'total_producto'=>$venta['total_producto']
            ]);
        }




        return Redirect::route('ventas')->with('success', 'Venta agregada.');
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

        $product = Product::find($id);
        return Inertia::render('Sells/Edit', [
            'product' => new ProductResource($product),
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
    public function update(ProductUpdateRequest $request)
    {
        $product = Product::find($request->id);
        $product->update($request->validated());

        return Redirect::back()->with('success', 'Producto Editado.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {   
        $product=Product::find($id);
        $product->delete();

        return Redirect::route('products')->with('success', 'Producto borrado.');
    }
}
