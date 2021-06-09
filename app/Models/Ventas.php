<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ventas extends Model
{
    use HasFactory;

    protected $fillable = [
        'cliente',
        'vendedor_id',
        'tipoPago',
        'total' 
    ];


    public function venta_detalles()
    {
        return $this->hasMany(VentaDetalle::class);
    }

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where('vendedor', 'like', '%'.$search.'%')
            ->orWhere('numeroVenta', 'like', '%'.$search.'%')
            ->orWhere('cliente', 'like', '%'.$search.'%')
            ->orWhere('tipoPago', 'like', '%'.$search.'%');
        })->when($filters['trashed'] ?? null, function ($query, $trashed) {
            // if ($trashed === 'with') {
            //     $query->withTrashed();
            // } elseif ($trashed === 'only') {
            //     $query->onlyTrashed();
            // }
        });
    }
}
