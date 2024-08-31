<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VentaDetalle extends Model
{
    use HasFactory;

    protected $fillable =[        
        'ventas_id','producto', 'product_id' , 'product_code','cantidad', 'precio', 'descuento', 'costo_servicio', 'total_producto','category_id', 'organization_id', 'estado', 'garantia', 'fin_garantia'];
    
    protected $appends = ['discountAmount', 'fullName'];

    public function venta()
    {
        return $this->belongsTo(Ventas::class);
    }

    public function getDiscountAmountAttribute()
    {
        return $this->precio * $this->descuento;
    }

    public function getFullNameAttribute()
    {
        //  ''+detalle.cantidad+' '+detalle.producto+' - (discountAmount) = '+detalle.total_producto
        return $this->cantidad . ' ' . $this->producto . ' = L ' . $this->total_producto;
    }
}
