<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'product_code' => $this->product_code,
            'cost_price' => $this->cost_price,
            'color'=>$this->color,
            'sell_price' => $this->sell_price,
            'existencia' => $this->existencia,
            'created_at' => $this->created_at,
            'category' => $this->category()->first(),
        ];
    }
}
