<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Servicios extends Model
{


    use HasFactory;


    protected $fillable = [
        'nombre',
        'costo',
        'service_code',
        'pago'
    ];

    public function venta_detalles()
    {
        return $this->hasMany(VentaDetalle::class);
    }


    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where('nombre', 'like', '%'.$search.'%')
            ->orWhere('pago', 'like', '%'.$search.'%')
            ->orWhere('cliente', 'like', '%'.$search.'%');
        })->when($filters['trashed'] ?? null, function ($query, $trashed) {
            // if ($trashed === 'with') {
            //     $query->withTrashed();
            // } elseif ($trashed === 'only') {
            //     $query->onlyTrashed();
            // }
        });
    }
}
