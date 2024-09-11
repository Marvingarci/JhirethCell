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

    protected $appends = ['products', 'inventarios'];

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

    // if any of the fillable fields is null, set 'N/A' as default value
    public function getNoteAttribute($value)
    {
        return $value ?? 'N/A';
    }


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

    public function user()
    {
        return $this->hasOne(User::class, 'id' , 'user_id');
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class, 'organization_id' , 'id');
    }

    public function venta()
    {
        return $this->belongsTo(Ventas::class, 'venta_id' , 'id');
    }

    public function getProductsAttribute()
    {
        if ($this->product_id) {
            return Product::whereIn('id', $this->product_id)->get();
        }
        return null;
    }
    
    public function getInventariosAttribute()
    {
        if ($this->inventario_id) {
            return Inventario::whereIn('id', $this->inventario_id)->get();
        }
        return null;
    }

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where('description', 'like', '%'.$search.'%');
        })->when($filters['date'] ?? null, function ($query, $date) {
            $query->where('created_at', 'like', $date . '%');
        })->when($filters['organization'] ?? null, function ($query, $organization) {
            $query->where('organization_id', $organization);
        })->when($filters['module'] ?? null, function ($query, $module) {
            $query->where('module', $module);
        })->when($filters['venta_id'] ?? null, function ($query, $venta_id) {
            $query->where('venta_id', $venta_id);
        })->when($filters['action'] ?? null, function ($query, $action) {
            $query->where('action', $action);
        })->when($filters['user_id'] ?? null, function ($query, $user_id) {
            $query->where('user_id', $user_id);
        })->when($filters['product_id'] ?? null, function ($query, $product_id) {
            $query->where('product_id', 'like', '%'.$product_id.'%');
        })->when($filters['inventario_id'] ?? null, function ($query, $inventario_id) {
            $query->where('inventario_id', 'like', '%'.$inventario_id.'%');
        });
    }

}
