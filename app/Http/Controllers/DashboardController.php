<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\VentaRapida;
use App\Models\VentaDetalle;
use App\Models\User;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $mas_vendidos = DB::table('venta_detalles')
        ->select(
            'producto',
            DB::raw('SUM(cantidad) as total_vendido')
        )
        ->where([
            ['estado', 'efectivo'],
        ])
        ->groupBy('producto')
        ->orderBy('total_vendido', 'desc')
        ->limit(3)
        ->get();

        $mejores_clientes = DB::table('ventas')
        ->select(
            'cliente',
            DB::raw('SUM(total) as total')
        )
        ->where([
            ['tipoPago', 'efectivo'],
        ])
        ->groupBy('cliente')
        ->orderBy('total', 'desc')
        ->limit(3)
        ->get();


        $macAddressWin = exec('getmac'); // On Windows
        $macAddressMAC = exec('ifconfig -a | grep -o -E "([0-9a-fA-F]{2}[:-]){5}([0-9a-fA-F]{2})" | head -n 1');

        return Inertia::render('Dashboard/Index',[
            'mas_vendidos' => $mas_vendidos,
            'best_clientes' => $mejores_clientes,
            'macAddress' => $macAddressWin,
        ]);
    }
}
