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
        })->when($filters['organization'] ?? null, function ($query, $organization) {
            //Inventario has a existenciaDividida column that is a json column like this [{"organization_id":3,"company_name":"JHIRETCELL PRINCIPAL","cantidad":1},{"organization_id":5,"company_name":"Jhiretcell #3","cantidad":0}]
            // check if the organization_id is in the existenciaDividida column and also the cantidad is greater than 0
            // can we get the string, convert it to an array of object and then filter it?
            // organization id to int

            $query->whereRaw("
    JSON_CONTAINS(existenciaDividida, JSON_OBJECT('organization_id', ?), '$') 
    AND (
        SELECT JSON_EXTRACT(jt.elem, '$.cantidad')
        FROM JSON_TABLE(existenciaDividida, '$[*]' COLUMNS (elem JSON PATH '$')) AS jt
        WHERE JSON_EXTRACT(jt.elem, '$.organization_id') = ?
        LIMIT 1
    ) > ?
", [(int)$organization, (int)$organization, 0]);         // use other method to do the same above and cantidad greater than 0




        });
    }
}
