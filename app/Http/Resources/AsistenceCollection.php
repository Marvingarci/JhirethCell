<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class AsistenceCollection extends ResourceCollection
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
            'id', 'vendedor_name', 'user_id', 'created_at_day', 'created_at', 'created_at_day_diff'
        )->filter(function ($asistence) {
            return isset($asistence['created_at_day']['first']) && 
                   $asistence['created_at_day']['first'] == $asistence['created_at'];
        });
    }
}
