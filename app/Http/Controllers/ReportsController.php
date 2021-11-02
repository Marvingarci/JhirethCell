<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;
use App\Models\Ventas;
use App\Models\VentaDetalle;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Http\Request;

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
        $Ventas_pantallas = Ventas::with(['venta_detalles' => function ($query) {
            $query->where('category_id', 1);
        }])->where([['created_at', 'like', $today->format('Y-m-d') . '%']])->get();

        $Ventas_celulares = Ventas::with(['venta_detalles' => function ($query) {
            $query->where('category_id', 2);
        }])->where([['created_at', 'like', $today->format('Y-m-d') . '%']])->get();

        $Ventas_accesorios = Ventas::with(['venta_detalles' => function ($query) {
            $query->where('category_id', 3);
        }])->where([['created_at', 'like', $today->format('Y-m-d') . '%']])->get();

        $productos = Product::all();
      //  dd($Ventas_pantallas);
        // $Ventas_celulares = Ventas::where([['created_at', 'like', $today->format('Y-m-d') . '%'],['tipoPago', 'efectivo'],['category_id', 2]])->with('venta_detalles')->get();
        // $Ventas_accesorios = Ventas::where([['created_at', 'like', $today->format('Y-m-d') . '%'],['tipoPago', 'efectivo'],['category_id', 3]])->with('venta_detalles')->get();


        return Inertia::render('Reports/SeparateReport',[
            'ventas_pantallas'=> $Ventas_pantallas,
            'ventas_celulares'=> $Ventas_celulares,
            'ventas_accesorios'=> $Ventas_accesorios,
            'productos' => $productos
        ]);    
    }

    public function separateReportByDay(Request $request)
    {
        $today = $request->day; 
        $Ventas_pantallas = Ventas::with(['venta_detalles' => function ($query) {
            $query->where('category_id', 1);
        }])->where([['created_at', 'like', $today . '%']])->get();

        $Ventas_celulares = Ventas::with(['venta_detalles' => function ($query) {
            $query->where('category_id', 2);
        }])->where([['created_at', 'like', $today . '%']])->get();

        $Ventas_accesorios = Ventas::with(['venta_detalles' => function ($query) {
            $query->where('category_id', 3);
        }])->where([['created_at', 'like', $today . '%']])->get();

        $productos = Product::all();

       

        return Inertia::render('Reports/SeparateReport',[
            'ventas_pantallas'=> $Ventas_pantallas,
            'ventas_celulares'=> $Ventas_celulares,
            'ventas_accesorios'=> $Ventas_accesorios,
            'day'=> $today,
            'productos' => $productos
        ]);     
    }

    public function creditReport()
    {
        $today = Carbon::today();
        $Ventas_hoy = Ventas::where([['created_at', 'like', $today->format('Y-m-d') . '%'],['tipoPago', 'credito']])->with('venta_detalles')->get();
        return Inertia::render('Reports/CreditReport',[
            'ventas'=> $Ventas_hoy
        ]);    }
}
