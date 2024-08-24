<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gasto extends Model
{
    use HasFactory;

    protected $table = 'expenses';

    protected $appends = ['vendedor_name'];

    protected $fillable = [
        'id',
        'vendedor_id',
        'organization_id',
        'title',
        'description',
        'total',
        'invoice',
        'evidence'
    ];

    public function vendedor()
    {
        return $this->hasOne(User::class, 'id' , 'vendedor_id');
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class, 'organization_id' , 'id');
    }

    public function getVendedorNameAttribute()
    {
        return isset($this->vendedor) ? $this->vendedor->first_name . ' ' . $this->vendedor->last_name : 'Usuario Inactivo';
    }

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where('title', 'like', '%'.$search.'%')
            ->orWhere('description', 'like', '%'.$search.'%');
        })->when($filters['date'] ?? null, function ($query, $date) {
            $query->where('created_at', 'like', $date . '%');
        })->when($filters['organization'] ?? null, function ($query, $organization) {
            $query->where('organization_id', $organization);
        });
    }
}
