<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Models\Payment;
use App\Models\Product;
use Inertia\Inertia;
use App\Models\Ventas;
use App\Models\VentaDetalle;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Http\Request;
use App\Http\Resources\ProductCollection;

class ReportsController extends Controller
{
    public function __invoke()
    {
        $today = Carbon::today();

        // $cigars = DB::table('tickets')
        //     ->join('products', 'tickets.product_id', '=', 'products.id')
        //     ->select(
        //         'products.name',
        //         DB::raw('SUM(amount_of_cigars) as total_cigars')
        //     )
        //     ->where([
        //         ['tickets.created_at', 'like',  $today->format('Y-m-d') . '%'],
        //         ['status', 'en bodega'],
        //     ])
        //     ->groupBy('product_id')
        //     ->orderBy('total_cigars', 'desc')
        //     ->limit(3)
        //     ->get();

        $Ventas_hoy = Ventas::where([['created_at', 'like', $today->format('Y-m-d') . '%'],['tipoPago', 'efectivo']])->with('venta_detalles')->get();

        return Inertia::render('Reports/Index',[
            'ventas'=> $Ventas_hoy
        ]);
    }


    public function dailyReport()
    {
        $today = Carbon::today();
        $Ventas_hoy = Ventas::where([['created_at', 'like', $today->format('Y-m-d') . '%'],['tipoPago', 'efectivo']])->with('venta_detalles')->get();
        return Inertia::render('Reports/DayliReport',[
            'ventas'=> $Ventas_hoy
        ]);
    }

    public function separateReport()
    {
        $today = Carbon::today();
        $organizations = Organization::all();

        $Ventas_pantallas = Ventas::with(['venta_detalles' => function ($query) {
            $query->where('category_id', 1);
        }])->where([['fecha_efectiva', 'like', $today->format('Y-m-d') . '%']])->get();

        $Ventas_celulares = Ventas::with(['venta_detalles' => function ($query) {
            $query->where('category_id', 2);
        }])->where([['fecha_efectiva', 'like', $today->format('Y-m-d') . '%']])->get();

        $Ventas_accesorios = Ventas::with(['venta_detalles' => function ($query) {
            $query->where('category_id', 3);
        }])->where([['fecha_efectiva', 'like', $today->format('Y-m-d') . '%']])->get();

        $Servicios = Ventas::with(['venta_detalles' => function ($query) {
            $query->where('category_id', 4);
        }])->where([['fecha_efectiva', 'like', $today->format('Y-m-d') . '%']])->get();

        $productos = Product::all();
      //  dd($Ventas_pantallas);
        // $Ventas_celulares = Ventas::where([['created_at', 'like', $today->format('Y-m-d') . '%'],['tipoPago', 'efectivo'],['category_id', 2]])->with('venta_detalles')->get();
        // $Ventas_accesorios = Ventas::where([['created_at', 'like', $today->format('Y-m-d') . '%'],['tipoPago', 'efectivo'],['category_id', 3]])->with('venta_detalles')->get();


        return Inertia::render('Reports/SeparateReport',[
            'ventas_pantallas'=> $Ventas_pantallas,
            'ventas_celulares'=> $Ventas_celulares,
            'ventas_accesorios'=> $Ventas_accesorios,
            'ventas_accesorios'=> $Ventas_accesorios,
            'organizations'=> $organizations,
            'servicios'=> $Servicios,
            'productos' => $productos
        ]);    
    }

    public function paymentsReport()
    {
        $today = Carbon::today();
        $payments = Payment::with(['venta', 'user' ])->where([['created_at', 'like', $today->format('Y-m-d') . '%']])->get();
        $total = 0;
        foreach ($payments as $pay) {
            $total += $pay->cantidad;
        }

        $productos = Product::all();
       
        return Inertia::render('Reports/PaymentsReport',[
            'payments'=> $payments,
            'total'=> $total,
            // 'ventas_accesorios'=> $Ventas_accesorios,
            'productos' => $productos
        ]);    
    }

    public function separateReportByDay(Request $request)
    {
        $today = $request->day; 
        $organization_id = $request->organization; 
        $organizations = Organization::all();

        
        $Ventas_pantallas = Ventas::with(['venta_detalles' => function ($query) {
            $query->where('category_id', 1);
        }])->where([['fecha_efectiva', 'like', $today . '%']])->where([['organization_id', $organization_id ]])->get();

        $Ventas_celulares = Ventas::with(['venta_detalles' => function ($query) {
            $query->where('category_id', 2);
        }])->where([['fecha_efectiva', 'like', $today . '%']])->where([['organization_id', $organization_id ]])->get();

        $Ventas_accesorios = Ventas::with(['venta_detalles' => function ($query) {
            $query->where('category_id', 3);
        }])->where([['fecha_efectiva', 'like', $today . '%']])->where([['organization_id', $organization_id ]])->get();

        $Servicios = Ventas::with(['venta_detalles' => function ($query) {
            $query->where('category_id', 4);
        }])->where([['fecha_efectiva', 'like', $today . '%']])->where([['organization_id', $organization_id ]])->get();

        $productos = Product::all();

       

        return Inertia::render('Reports/SeparateReport',[
            'ventas_pantallas'=> $Ventas_pantallas,
            'ventas_celulares'=> $Ventas_celulares,
            'ventas_accesorios'=> $Ventas_accesorios,
            'organizations'=> $organizations,
            'servicios'=> $Servicios,
            'day'=> $today,
            'productos' => $productos
        ]);     
    }

    public function creditReport()
    {
        $today = Carbon::today();
        $organizations = Organization::all();

        $Ventas_hoy = Ventas::where([['created_at', 'like', $today->format('Y-m-d') . '%'],['tipoPago', 'credito']])->with('venta_detalles')->get();
        return Inertia::render('Reports/CreditReport',[
            'ventas'=> $Ventas_hoy,
            'organizations'=> $organizations
        ]);    
    }

    public function inventarioReport()
    {
        $today = Carbon::today();
        $organizations = Organization::all();

        // $pre = new ProductCollection(
        //     Product::orderBy('name')->get());

        return Inertia::render('Reports/InventarioReport',[
            // 'products'=> $pre,
            'organizations'=> $organizations
        ]);    
    }

    public function inventarioPorTienda(Request $request)
    {
        $organization_id = $request->organization; 
        $organizations = Organization::all();

        $pre =new ProductCollection(
            Product::orderBy('name')->take(100)->get());
        
        $final = $pre->filter(function($product)use($organization_id){
            $found = false;
            if(!empty($product->existenciaDividida) && count($product->existenciaDividida) > 0){
                foreach ($product->existenciaDividida as $item) {
                    if($item->organization_id == $organization_id && $item->cantidad > 0){
                        $found= true;
                    }
                }
            }
            return $found;
        })->map(function ($item) {
            // Access both original and mutated attributes
            return [
                'id' => $item->id,
                'name' => $item->name,
                'category_id' => $item->category_id,
                'color' => $item->color,
                'dbType' => $item->dbType,
                'whole_sell_price' => $item->whole_sell_price,
                'sell_price' => $item->sell_price,
                'created_at' => $item->created_at,
                'realExistencia' => $item->realExistencia,
                'existenciaDividida' => $item->existenciaDividida,
            ];
        });
        

        
        return Inertia::render('Reports/InventarioReport',[
            'products'=> $final,
            'organizations'=> $organizations,
        ]);    
    }

    function filterByOrganization($product, $key){
        $found = false;
        if(!empty($product->existenciaDividida)){
            foreach ($product->existenciaDividida as $item) {
                if($item['organization_id'] == '1'){
                    $found= true;
                }
            }
        }
        return $found;
    }
    

    public function creditReportByDay(Request $request)
    {
        $today = $request->day; 
        $organization_id = $request->organization; 
        $organizations = Organization::all();

        $Ventas_hoy = Ventas::where([['created_at', 'like', $today->format('Y-m-d') . '%'],['tipoPago', 'credito']])->with('venta_detalles')
        ->where([['fecha_efectiva', 'like', $today . '%']])->where([['organization_id', $organization_id ]])->get();
        
        return Inertia::render('Reports/CreditReport',[
            'ventas'=> $Ventas_hoy,
            'organizations'=> $organizations,
        ]);    
    }
}
