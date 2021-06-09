<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VentaDetalle extends Model
{
    use HasFactory;

    protected $fillable =[        
        'venta_id','producto', 'cantidad', 'precio', 'descuento', 'total_producto'];
    

    public function venta()
    {
        return $this->belongsTo(Ventas::class);
    }
}
