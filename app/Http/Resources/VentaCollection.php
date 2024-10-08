<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class VentaCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return $this->collection->map->only(
            'id', 'numeroVenta', 'cliente', 'vendedor_id', 'vendedor', 'total', 'tipoPago','created_at', 'has_many_payments', 'venta_detalles', 'is_credito', 'restante', 'organization_id', 'limite_pago'
        );
    }
}
