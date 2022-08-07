<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ventas extends Model
{
    use HasFactory;

    protected $fillable = [
        'cliente',
        'contact_id',
        'vendedor_id',
        'tipoPago',
        'fecha_efectiva',
        'organization_id',
        'dias_credito',
        'limite_pago',
        'total', 
        'restante', 
    ];


    public function venta_detalles()
    {
        return $this->hasMany(VentaDetalle::class);
    }

    public function pagos()
    {
        return $this->hasMany(Payment::class);
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class, 'organization_id' , 'id');
    }


    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where('cliente', 'like', '%'.$search.'%')
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
