<?php

namespace App\Http\Controllers;

use App\Models\VentaRapida;
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

class VentaRapidaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Inertia::render('Sells/IndexFast', [
            'filters' => Request::all('search', 'trashed'),
            'categorias' => Category::all(),
            'usuarios'=> User::all(['id','first_name','last_name']),
            'producto'=> DB::table('products')->where('product_code',Request::only('search', 'trashed'))->first(),
            'ventasRapidas' => Ventas::with('venta_detalles')->where('tipoPago', 'pendiente')->get()
        ]);
    }

    public function verGarantias()
    {
        return Inertia::render('Dashboard/GarantiaIndex', [
            'filters' => Request::all('search', 'trashed'),
            'categorias' => Category::all(),
            'usuarios'=> User::all(['id','first_name','last_name']),
            'ventaRapida'=> VentaDetalle::where('product_code',Request::only('search', 'trashed'))->with('venta')->first(),
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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\VentaRapida  $ventaRapida
     * @return \Illuminate\Http\Response
     */
    public function show(VentaRapida $ventaRapida)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\VentaRapida  $ventaRapida
     * @return \Illuminate\Http\Response
     */
    public function edit(VentaRapida $ventaRapida)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\VentaRapida  $ventaRapida
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, VentaRapida $ventaRapida)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\VentaRapida  $ventaRapida
     * @return \Illuminate\Http\Response
     */
    public function destroy(VentaRapida $ventaRapida)
    {
        //
    }
}
