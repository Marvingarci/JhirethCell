<?php

namespace App\Http\Controllers;

use App\Http\Requests\InventarioStoreRequest;
use App\Models\Inventario;
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

class InventarioController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
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


    public function buscarProducto()
    {
        return Inertia::render('Inventories/Index', [
            'filters' => Request::all('search', 'trashed'),
            'categorias' => Category::all(),
            'usuarios'=> User::all(['id','first_name','last_name']),
            'producto'=> Inventario::where('codebar',Request::only('search', 'trashed'))->with('product')->first(),
        ]);
    }
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(InventarioStoreRequest $request)
    {
        Auth::user()->account->inventario()->create($request->validated());
        return Redirect::back()->with('success', 'Registro agregado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Inventario  $inventario
     * @return \Illuminate\Http\Response
     */
    public function show(Inventario $inventario)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Inventario  $inventario
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $product = Product::find($id);
        return Inertia::render('Inventories/Edit', [
            'filters' => Request::all('search', 'trashed'),
            'inventario' => Inventario::where([['product_id', $id],['codebar', Request::all('search', 'trashed')]])->get(),
            'product' => new ProductResource($product),
            'categorias'=> Category::All()
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Inventario  $inventario
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Inventario $inventario)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Inventario  $inventario
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $eliminar = Inventario::find($id);
        $eliminar->delete();
        return Redirect::back()->with('success', 'Eliminado con éxito');
    }
}
