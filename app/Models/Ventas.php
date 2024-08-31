<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ventas extends Model
{
    use HasFactory;

    protected $appends = ['has_many_payments', 'is_credito'];

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
        'multiplePayments'
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

    public function vendedor()
    {
        return $this->hasOne(User::class, 'id' , 'vendedor_id');
    }

    public function getHasManyPaymentsAttribute()
    {
        return $this->pagos()->count() >= 1 ? true : false;
    }

    public function getIsCreditoAttribute()
    {
        return ($this->has_many_payments && $this->limite_pago != null) ? true : false;
    }



    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where('cliente', 'like', '%'.$search.'%')
            ->orWhere('tipoPago', 'like', '%'.$search.'%')
            ->orWhere('id', 'like', '%'.$search.'%');
        })->when($filters['date'] ?? null, function ($query, $date) {
            $query->where('created_at', 'like', $date . '%');
        })->when($filters['organization'] ?? null, function ($query, $organization) {
            $query->where('organization_id', $organization);
        });
    }
}
