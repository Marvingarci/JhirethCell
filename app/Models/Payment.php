<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'ventas_id',
        'vendedor_id',
        'comentario',
        'cantidad',
        'concepto'
    ];

    protected $appends = ['vendedor'];

    public function venta()
    {
        return $this->belongsTo(Ventas::class, 'ventas_id' , 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'vendedor_id', 'id');
    }

    public function getVendedorAttribute()
    {
        return $this->user->name;
    }
    
    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where('name', 'like', '%'.$search.'%');
        })->when($filters['date'] ?? null, function ($query, $date) {
            $query->where('created_at', 'like', $date . '%');
        });
    }
}
