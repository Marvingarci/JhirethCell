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
use App\Models\Registro;
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
        DB::beginTransaction();

        try {
            $payment = Payment::create($request->validated());

            $venta = Ventas::where('id',$request['ventas_id'])->with('venta_detalles')->first();
            $venta->restante = $venta->restante - $payment->cantidad;
            $venta->update();
            
            $ventas = $venta->venta_detalles;
            if($venta->restante == 0){

                $venta->tipoPago = 'efectivo';
                $venta->fecha_efectiva = Carbon::now();
                $venta->update();


                foreach ($ventas as $v) {
                    $venta_detalle = VentaDetalle::find($v["id"]);
                    $venta_detalle->estado = 'efectivo';
                    $venta_detalle->update();
                }
            }

            $log = 'El usuario ' . Auth::user()->name . ' ' . Auth::user()->last_name . ' ha realizado un abono en '.$payment->concepto.' de L ' . $payment->cantidad . ' a la venta #' . $venta->id . ', quedando un saldo pendiente de L ' . $venta->restante .
            ' con fecha limite de pago: ' .Carbon::parse($venta->limite_pago)->format('Y-m-d') .'.';

            $ventas = $ventas->toArray();
            $inventoriesIds = array_reduce($ventas, function ($carry, $item) {
                $carry[] = $item['product_code'];
                return $carry;
            }, []);

            $productsIds = array_reduce($ventas, function ($carry, $item) {
                $carry[] = $item['product_id'];
                return $carry;
            }, []);

            $registroLog = Registro::create([
                'user_id' => Auth::user()->id,
                'organization_id' => Auth::user()->organization_id,
                'module' => 'Ventas',
                'venta_id' => $venta->id,
                'inventario_id' => $inventoriesIds,
                'product_id' => $productsIds,
                'action' => 'Abono a Venta',
                'description' => $log,
                'note' => ($venta->restante == 0) ? 'Venta convertida a efectivo' : ''
            ]);

            DB::commit();



        } catch (\Exception $e) {
            DB::rollBack();
            dd($e->getMessage());
            return Redirect::back()->with('error', 'Error al agregar el pago.');
        }
        return Redirect::to('/ventas/'.$request['ventas_id'].'/edit')->with('success', 'Pago agregado con éxito.');
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
