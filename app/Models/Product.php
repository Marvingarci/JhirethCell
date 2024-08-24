<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

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

    protected $casts = [
        'existenciaDividida' => 'array',
        'realExistencia' => 'integer',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function getRealExistenciaAttribute()
    {

        $inventarios = DB::table("inventarios")
        ->select(DB::raw("product_id , existenciaDividida"))
        ->where('product_id', $this->id)
        ->get();

        $real = 0;
        if($this->dbType == 'colectivo'){
                $total = 0;
                foreach ($inventarios as $quan) {
                    if(isset($quan->existenciaDividida)){
                    $json = json_decode($quan->existenciaDividida);
                        foreach ($json as $orga) {
                            if($orga->organization_id != null){
                                $total += intval($orga->cantidad);
                            }
                        }
                
                    }
                }
                $real = $total;
            } elseif($this->dbType == 'individual'){
                $real = 0;
                $quan = DB::table("inventarios as i")
                ->select(DB::raw("COUNT(*) as cuenta, i.organization_id"))
                ->where('i.status', 'stock')
                ->where('i.product_id', $this->id)
                ->groupBy('i.organization_id')
                ->get();

                foreach ($quan as $orga) {
                    if($orga->organization_id != null){
                        $real += $orga->cuenta;
                    }
                }
            }

        return $real;

    }

    public function getExistenciaDivididaAttribute()
    {
        $inventarios = DB::table("inventarios")
        ->select(DB::raw("product_id , existenciaDividida"))
        ->where('product_id', $this->id)
        ->get();

        $real = [];
        if($this->dbType == 'colectivo'){
                $total = 0;
                foreach ($inventarios as $quan) {
                    if(isset($quan->existenciaDividida)){
                    $json = json_decode($quan->existenciaDividida);
                        foreach ($json as $orga) {
                            if($orga->organization_id != null){
                                array_push($real, $orga);
                                $total = intval($orga->cantidad);
                            }
                        }
                
                    }
                }                
            } elseif($this->dbType == 'individual'){
                // $real = 0;
                $quan = DB::table("inventarios as i")
                ->leftJoin('organizations as orga', 'orga.id' , '=', 'i.organization_id')
                ->select(DB::raw("COUNT(*) as cuenta, i.organization_id, name"))
                ->where('i.status', 'stock')
                ->where('i.product_id', $this->id)
                ->groupBy('i.organization_id')
                ->get();

                foreach ($quan as $orga) {
                    if($orga->organization_id != null){
                        array_push($real, (object)["organization_id" => $orga->organization_id, "company_name" => $orga->name, "cantidad" => $orga->cuenta]);
                    }
                }
            }
        
        return $real;
    }

    public function hello(){
        return "Hello";
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
