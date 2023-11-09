<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transferencia extends Model
{
    use HasFactory;
    protected $table = 'transferencias';

    protected $fillable = [
        'id',
        'description',
        'note',
        'product_id',
        'old_company',
        'new_company',
        'dbType',
        'send_by',
        'received_by',
        'confirmation',
        'inventory_id',
        'created_at',
        'updated_at'
    ];

    public function old_organization()
    {
        return $this->hasOne(Organization::class, 'id' , 'old_company');
    }

    public function new_organization()
    {
        return $this->hasOne(Organization::class, 'id' , 'new_company');
    }

    public function enviado_por()
    {
        return $this->hasOne(User::class, 'id' , 'send_by');
    }

    public function recibido_por()
    {
        return $this->hasOne(User::class, 'id' , 'received_by');
    }

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where('description', 'like', '%'.$search.'%');
        })->when($filters['trashed'] ?? null, function ($query, $trashed) {
        });
    }
}
