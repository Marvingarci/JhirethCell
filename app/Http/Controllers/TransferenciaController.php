<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTransferenciaRequest;
use App\Http\Requests\UpdateTransferenciaRequest;
use App\Models\Transferencia;
use App\Http\Resources\TransferenciaCollection;
use App\Models\Product;
use Inertia\Inertia;
use App\Models\Organization;
use App\Models\Category;
use App\Models\Contact;
use App\Models\Inventario;
use App\Models\User;
use App\Models\Servicios;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Request;
use Illuminate\Http\Request as HttpRequest;
use Illuminate\Support\Facades\Redirect;
use Carbon\Carbon;

class TransferenciaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
    
        $pre = new TransferenciaCollection(
            Transferencia::orderBy('created_at', 'desc')
                // ->select('id','name','color','sell_price','whole_sell_price')
                ->with('enviado_por', 'recibido_por', 'old_organization', 'new_organization')
                ->filter(Request::only('search', 'trashed'))
                ->paginate()
                ->appends(Request::all())
        );
        // $inventario = DB::table('inventarios as i')->selectRaw('i.*')->join('products as p', 'p.id', '=', 'i.product_id')->where('p.dbType', 'colectivo')->get();
        // foreach ($inventario as &$inven) {
        //     $organiza = Organization::select('id','name')->where('id', $inven->organization_id)->first();
        //     $existenciaDividida = [[
        //         'organization_id' => $organiza->id,
        //         'company_name' => $organiza->name,
        //         'cantidad'=> $inven->existencia
        //     ]];
        //     if(!isset($inven->existenciaDividida) && $inven->existenciaDividida == null){
        //         $inven->existenciaDividida = json_encode($existenciaDividida);
        //         Inventario::where('id', $inven->id)->update(['existenciaDividida' => json_encode($existenciaDividida)]);
        //     }

        // }
        return Inertia::render('Transfer/Index', [
            'filters' => Request::all('search', 'trashed'),
            'transferencias' => $pre,
            // 'inventario' => $inventario
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return Inertia::render('Transfer/Create', [
            'filters' => Request::all('search', 'trashed'),
            'usuarios'=> User::with('organization')->get(),
            'tiendas'=> Organization::all(['id','name']),
            'producto'=> Inventario::where('codebar',Request::only('search', 'trashed'))->with('product')->first(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreTransferenciaRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreTransferenciaRequest $request)
    {
        $hoy = Carbon::now();
        $items = $request['items'];
        unset($request['items']);

        foreach ($items as $item) {
            if($item['dbType'] == 'colectivo'){
                $inven = Inventario::where('codebar', $item['codebar'])->first();
                $organizations = $inven->existenciaDividida == null ? [] : json_decode($inven->existenciaDividida);
                if(count($organizations) > 0){
                    $found = false;
                    foreach ($organizations as $orga) {
                        if($orga->organization_id == $request['new_company']){
                            $orga->cantidad += $item['cantidad'];
                            $found = true;
                        }else if($orga->organization_id == $request['old_company']){
                            $orga->cantidad -= $item['cantidad'];
                        }
                    }   

                    if(!$found){
                        $company = Organization::where('id', $request['new_company'])->first();
                        array_push($organizations, ['organization_id' => $request['new_company'], 'company_name' => $company->name, 'cantidad' => $item['cantidad']]);
                    }

                    $inven->existenciaDividida = json_encode($organizations);
                    $inven->save();
                }
            }else{
                Inventario::where('codebar', $item['codebar'])->update(['organization_id' => $request['new_company']]);
            }
        }

        $registro = Transferencia::create($request->validated());
        

        
        // return Redirect::back()->with('success', 'Transferencia exitosa.');

        return Redirect::route('transfer.edit', $registro->id)->with('success', 'Transferencia editada');
    }

    public function show()
    {
        $inventario = DB::table('inventarios as i')->selectRaw('i.*')->join('products as p', 'p.id', '=', 'i.product_id')->where('p.dbType', 'colectivo')->get();

        return Redirect::back()->with(['success'=> 'Transferencia rels.', 'inventario'=> $inventario]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Transferencia  $transferencia
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        return Inertia::render('Transfer/Edit', [
            'transferencia' => Transferencia::with(['enviado_por', 'recibido_por', 'old_organization', 'new_organization'])->where('id',$id)->first(),
            'usuarios'=> User::with('organization')->get(),
            'tiendas'=> Organization::all(['id','name'])
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateTransferenciaRequest  $request
     * @param  \App\Models\Transferencia  $transferencia
     * @return \Illuminate\Http\Response
     */
    public function update(HttpRequest $request, Transferencia $transferencia)
    {
        $transferencia->confirmation = true;
        $transferencia->received_by = $request['received_by'];
        $transferencia->note = $request['note'];
        $transferencia->save();

        return Redirect::route('transfer.edit', $transferencia->id)->with('success', 'Transferencia editada');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Transferencia  $transferencia
     * @return \Illuminate\Http\Response
     */
    public function destroy(Transferencia $transferencia)
    {
        //
    }
}
