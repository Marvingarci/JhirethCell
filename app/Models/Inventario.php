<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventario extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'product_id',
        'codebar',
        'imei',
        'existencia',
        'color',
        'organization_id',
        'existenciaDividida',
        'status'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class, 'organization_id');
    }
    
    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where('code', 'like', '%'.$search.'%');
        })->when($filters['trashed'] ?? null, function ($query, $trashed) {
            // if ($trashed === 'with') {
            //     $query->withTrashed();
            // } elseif ($trashed === 'only') {
            //     $query->onlyTrashed();
            // }
        });
    }
}
