<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Registro extends Model
{
    use HasFactory;

    protected $table = 'registros';

    protected $casts = [
        'product_id' => 'array',
        'inventario_id' => 'array'
    ];


    protected $fillable = [
        'id',
        'user_id',
        'module',
        'venta_id',
        'product_id',
        'inventario_id',
        'organization_id',
        'action',
        'description',
        'note',
        'created_at',
        'updated_at'
    ];

    public function getProductIdAttribute($value)
    {
        return json_decode($value);
    }

    public function setProductIdAttribute($value)
    {
        $value = array_map('intval', $value);
        $this->attributes['product_id'] = json_encode($value);
    }

    public function getInventarioIdAttribute($value)
    {
        return json_decode($value);
    }

    public function setInventarioIdAttribute($value)
    {
        $value = array_map('intval', $value);
        $this->attributes['inventario_id'] = json_encode($value);
    }

}
