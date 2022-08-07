<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Http\Requests\PaymentStoreRequest;
use App\Http\Requests\ProductUpdateRequest;
use App\Http\Resources\ProductCollection;
use App\Http\Resources\ProductResource;
use Inertia\Inertia;
use App\Models\Organization;
use App\Models\Category;
use App\Models\Inventario;
use App\Models\Ventas;
use App\Models\VentaDetalle;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Carbon\Carbon;


class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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
    public function store(PaymentStoreRequest $request)
    {
        $payment = Payment::create($request->validated());

        $venta = Ventas::where('id',$request['ventas_id'])->with('venta_detalles')->first();
        $venta->restante = $venta->restante - $payment->cantidad;
        $venta->update();
        
        if($venta->restante == 0){

            $venta->tipoPago = 'efectivo';
            $venta->fecha_efectiva = Carbon::now();
            $venta->update();

            $ventas = $venta->venta_detalles;

            //Inventario::where('codebar', $request->venta_detalles['product_code'])->update(['status' => 'vendido']);
            foreach ($ventas as $v) {
                $venta_detalle = VentaDetalle::find($v["id"]);
                $venta_detalle->estado = 'efectivo';
                $venta_detalle->update();
            }
        }

        return Redirect::back()->with('success', 'Payment agregado con éxito.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Payment  $payment
     * @return \Illuminate\Http\Response
     */
    public function show(Payment $payment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Payment  $payment
     * @return \Illuminate\Http\Response
     */
    public function edit(Payment $payment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Payment  $payment
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Payment $payment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Payment  $payment
     * @return \Illuminate\Http\Response
     */
    public function destroy(Payment $payment)
    {
        //
    }
}
