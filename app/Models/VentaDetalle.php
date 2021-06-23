<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VentaDetalle extends Model
{
    use HasFactory;

    protected $fillable =[        
        'ventas_id','producto', 'product_id' , 'product_code','cantidad', 'precio', 'descuento', 'total_producto', 'estado', 'garantia', 'fin_garantia'];
    

    public function venta()
    {
        return $this->belongsTo(Ventas::class);
    }
}
