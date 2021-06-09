<?php

namespace App\Models;

class Account extends Model
{
    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function organizations()
    {
        return $this->hasMany(Organization::class);
    }

    public function contacts()
    {
        return $this->hasMany(Contact::class);
    }
    public function products()
    {
        return $this->hasMany(Product::class);
    }
    public function ventas()
    {
        return $this->hasMany(Ventas::class);
    }
}
