<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Ventas;
use App\Models\VentaDetalle;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;


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

        $Ventas_hoy = Ventas::where('created_at', 'like', $today->format('Y-m-d') . '%')->with('venta_detalles')->get();

        return Inertia::render('Reports/Index',[
            'ventas'=> $Ventas_hoy
        ]);
    }
}
