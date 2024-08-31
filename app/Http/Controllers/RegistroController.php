<?php

namespace App\Http\Controllers;

use App\Models\Registro;
use App\Models\Inventario;
use App\Models\Product;
use App\Http\Requests\StoreRegistroRequest;
use App\Http\Requests\UpdateRegistroRequest;

class RegistroController extends Controller
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

    public static function getExistenciaEnTexto($id, $name){
        $ex = '';
        $existence = 
        Product::where('id', $id)->first();
        if(count($existence->existenciaDividida)>0){
            $ex = '| De '.$name.'(Total '.$existence->realExistencia.') a este punto en ';
            foreach ($existence->existenciaDividida as $orga) {
                $ex .= $orga->company_name.' quedan '.$orga->cantidad.' unidades, ';
            }
        }
        return $ex;
    }

    public static function logNewVenta( $registro, $ventas){
        $log = 'El usuario '.$registro->vendedor->first_name.' '.$registro->vendedor->last_name.' creo la venta #'.$registro->id.' => '.$registro->tipoPago.
        ($registro->tipoPago == 'credito' ? ' a '.$registro->dias_credito.' dias.' : '')
        .' para el cliente '.$registro->cliente.' de un total de L '.$registro->total.', conteniendo: ';

        $inventariosIds = [];
        $existencia = '';
        $productsIds = [];
        foreach ($ventas as $venta) {
            if($venta['category_id'] != 4){
                $inventariosIds[] = $venta['id'];
                $productsIds[] = !isset($venta['codebar']) ? null : $venta['codebar']; 
                $existencia .= self::getExistenciaEnTexto($venta['id'], $venta['name']);
            }
            $log .= $venta['cantidad'].' '.$venta['name'].' con codigo/imei '.$venta['codebar'].' a L '.$venta['real_sell_price']
            .($venta['descuento'] > 0 ? ' con un descuento de L '.round($venta['real_sell_price'] * $venta['descuento'], 2).'' : '').
            ' cada uno en total L '.$venta['total_producto'].', ';
        }

    



        $registroLog = Registro::create([
            'user_id' => $registro->vendedor_id,
            'organization_id' => $registro->organization_id,
            'module' => 'Ventas',
            'venta_id' => $registro->id,
            'inventario_id' => $inventariosIds,
            'product_id' => $productsIds,
            'action' => 'Crear Venta',
            'description' => $log,
            'note' => $existencia
        ]);
        
    }

    public static function logDeleteVenta($registro, $ventas){
        $log = 'El usuario '.$registro->vendedor->first_name.' '.$registro->vendedor->last_name.' elimino la venta #'.$registro->id.' => '.$registro->tipoPago.
        ($registro->tipoPago == 'credito' ? ' a '.$registro->dias_credito.' dias.' : '')
        .' para el cliente '.$registro->cliente.' de un total de L '.$registro->total.', conteniendo: ';

        $inventariosIds = [];
        $existencia = '';
        $productsIds = [];
        foreach ($ventas as $venta) {
            if($venta['category_id'] != 4){
                $inventariosIds[] = $venta['product_code'];
                $productsIds[] = !isset($venta['product_id']) ? null : $venta['product_id']; 
                $existencia .= self::getExistenciaEnTexto($venta['product_id'], $venta['producto']);
            }
            $log .= $venta['cantidad'].' '.$venta['producto'].' con codigo/imei '.$venta['product_code'].' a L '.$venta['precio']
            .($venta['descuento'] > 0 ? ' con un descuento de L '.round($venta['precio'] * $venta['descuento'], 2).'' : '').
            ' cada uno en total L '.$venta['total_producto'].', ';
        }

        $registroLog = Registro::create([
            'user_id' => $registro->vendedor_id,
            'organization_id' => $registro->organization_id,
            'module' => 'Ventas',
            'venta_id' => $registro->id,
            'inventario_id' => $inventariosIds,
            'product_id' => $productsIds,
            'action' => 'Eliminar Venta',
            'description' => $log,
            'note' => $existencia
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
     * @param  \App\Http\Requests\StoreRegistroRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreRegistroRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Registro  $registro
     * @return \Illuminate\Http\Response
     */
    public function show(Registro $registro)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Registro  $registro
     * @return \Illuminate\Http\Response
     */
    public function edit(Registro $registro)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateRegistroRequest  $request
     * @param  \App\Models\Registro  $registro
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateRegistroRequest $request, Registro $registro)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Registro  $registro
     * @return \Illuminate\Http\Response
     */
    public function destroy(Registro $registro)
    {
        //
    }
}
