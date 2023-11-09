<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class TransferenciaCollection extends ResourceCollection
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
            'id',
            'description',
            'note',
            'product_id',
            'old_company',
            'old_organization',
            'new_company',
            'new_organization',
            'dbType',
            'send_by',
            'enviado_por',
            'received_by',
            'recibido_por',
            'confirmation',
            'inventory_id',
            'created_at',
            'updated_at'
        );
    }
}
