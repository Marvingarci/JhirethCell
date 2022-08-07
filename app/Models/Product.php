<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'name',
        'sell_price',
        'cost_price',
        'whole_sell_price',
        'dbType',
        'color',
        'category_id'
    ];


    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function inventarios()
    {
        return $this->hasMany(Inventario::class);
    }
    
    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where('name', 'like', '%'.$search.'%');
        })->when($filters['trashed'] ?? null, function ($query, $trashed) {
            // if ($trashed === 'with') {
            //     $query->withTrashed();
            // } elseif ($trashed === 'only') {
            //     $query->onlyTrashed();
            // }
        });
    }
}
