<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\VentaRapida;
use App\Models\VentaDetalle;
use App\Models\User;
use App\Models\Product;
use App\Models\Organization;
use Illuminate\Support\Facades\Auth;
// use Illuminate\Support\Facades\Request;
use Illuminate\Http\Request;
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

        $organizations = Organization::all(['id', 'name', 'devices']);
        // $actualOrganization = 
        return Inertia::render('Dashboard/Index',[
            'mas_vendidos' => $mas_vendidos,
            'best_clientes' => $mejores_clientes,
            'macAddress' => $macAddressWin,
            'organizations' => $organizations,
        ]);
    }

    public function saveCompany(Request $request){
        $organization = Organization::findOrFail($request->company_id);
        if($organization->devices != null){
            $organization->devices = array_merge($organization->devices, [$request->macAddress]);
        }else{
            $organization->devices = [$request->macAddress];
        }
        $organization->save();
        
        return Redirect::route('dashboard')->with('success', 'Dispositivo Registrado con exito.');
    }
}
