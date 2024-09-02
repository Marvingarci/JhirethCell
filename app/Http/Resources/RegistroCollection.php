<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class RegistroCollection extends ResourceCollection
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
            'user_id',
            'user',
            'module',
            'venta_id',
            'venta',
            'product_id',
            'products',
            'inventario_id',
            'inventarios',
            'organization_id',
            'organization',
            'action',
            'description',
            'note',
            'created_at',
        );
    }
}
