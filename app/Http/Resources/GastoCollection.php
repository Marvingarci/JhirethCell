<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class GastoCollection extends ResourceCollection
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
            'vendedor_id',
            'organization_id',
            'title',
            'description',
            'total',
            'invoice',
            'evidence',
            'created_at',
            'vendedor_name'
        );
    }
}
