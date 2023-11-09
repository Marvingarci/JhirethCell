<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Organization extends Model
{
    use SoftDeletes, HasFactory;

    protected $casts = [
        'devices' => 'array',
    ];
    public function contacts()
    {
        return $this->hasMany(Contact::class);
    }

    public function users()
    {
        return $this->hasMany(User::class, 'organization_id', 'id');
    }

    public function ventas()
    {
        return $this->hasMany(Ventas::class, 'organization_id', 'id');
    }

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where('name', 'like', '%'.$search.'%');
        })->when($filters['trashed'] ?? null, function ($query, $trashed) {
            if ($trashed === 'with') {
                $query->withTrashed();
            } elseif ($trashed === 'only') {
                $query->onlyTrashed();
            }
        });
    }
}
