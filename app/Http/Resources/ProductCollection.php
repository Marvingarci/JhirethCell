<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class ProductCollection extends ResourceCollection
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
            'id', 'name', 'product_code', 'category_id', 'dbType',  'color', 'cost_price', 'sell_price','whole_sell_price', 'existencia', 'realExistencia', 'existenciaDividida','created_at'
        );
    }
}
