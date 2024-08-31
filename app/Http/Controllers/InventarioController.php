<?php

namespace App\Http\Controllers;

use App\Http\Requests\InventarioStoreRequest;
use App\Models\Inventario;
use Illuminate\Http\Request as HttpRequest;
use App\Http\Requests\VentaStoreRequest;
use App\Http\Requests\VentaUpdateRequest;
use App\Http\Resources\VentaCollection;
use App\Http\Resources\ProductResource;
use Inertia\Inertia;
use App\Models\Organization;
use App\Models\Category;
use App\Models\User;
use App\Models\Product;
use App\Models\Registro;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Http\Resources\ProductCollection;

class InventarioController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Inertia::render('Sells/Index', [
            'filters' => Request::all('search', 'trashed'),
            'usuarios'=> User::all(['id','first_name','last_name']),
            'ventas_dia' => new VentaCollection(
                Auth::user()->account->ventas()
                    ->orderBy('created_at', 'asc')
                    ->filter(Request::only('search', 'trashed'))
                    ->paginate()
                    ->appends(Request::all())
            ),
        ]);
    }


    public function buscarProducto()
    {
        $inventario = Inventario::where('codebar',Request::only('search', 'trashed'))->with('organization')->first();
        return Inertia::render('Inventories/Index', [
            'filters' => Request::all('search'),
            'producto'=> New ProductCollection(
                Product::where('id',
                 isset($inventario->product_id) ? $inventario->product_id : 0
                 )->get()
            ), 
            'inventario' => $inventario,

        ]);
    }
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(InventarioStoreRequest $request)
    {
        DB::beginTransaction();
        try {
            $inventario = Auth::user()->account->inventario()->create($request->validated());

            $log = 'El usuario '.Auth::user()->first_name.' '.Auth::user()->last_name.' creo el inventario de '.$inventario->product->name.' bajo el codigo '.$inventario->codebar.' con la cantidad de '.$inventario->existencia.' en la tienda '.Auth::user()->organization->name;

            $registroLogNewInventory = Registro::create([
                'user_id' => Auth::user()->id,
                'organization_id' => Auth::user()->organization_id,
                'module' => 'Inventario',
                'inventario_id' => [$inventario->codebar],
                'product_id' => [$inventario->product_id],
                'action' => 'Inventario creado',
                'description' => $log,
                'note' => ''
            ]);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            dd($e->getMessage());
            return Redirect::back()->with('error', 'Error al agregar el inventario.');
        }

        return Redirect::back()->with('success', 'Inventario agregado correctamente.');
    }

    public function actualizarInventario(HttpRequest $request)
    {
        DB::beginTransaction();
        try {
            $inventario = Inventario::find($request->productId);
            $log = 'El usuario '.Auth::user()->first_name.' '.Auth::user()->last_name.' actualizo el inventario de '.$inventario->product->name.' bajo el codigo '.$inventario->codebar.' con la siguiente cantidad en las tiendas: ';
            $existenciaDividida = json_decode($inventario->existenciaDividida);
            $newExistenciaDividida = json_decode($request->existenciaDividida);

            $changes = [];

            foreach ($existenciaDividida as $index => $original) {
                $updated = $newExistenciaDividida[$index];
                if ((int)$original->cantidad !== (int)$updated->cantidad) {
                    $changes[] = [
                        "organization_id" => $original->organization_id,
                        "company_name" => $original->company_name,
                        "old_cantidad" => $original->cantidad,
                        "new_cantidad" => $updated->cantidad
                    ];
                }
            }

            foreach ($changes as $change) {
                $log .= $change['company_name'].': de '.$change['old_cantidad'].' a '.$change['new_cantidad'].'; ';
            }
       
            $inventario->existencia = $request->existencia;
            $inventario->existenciaDividida = $request->existenciaDividida;
            
            $registroLogNewInventory = Registro::create([
                'user_id' => Auth::user()->id,
                'organization_id' => Auth::user()->organization_id,
                'module' => 'Inventario',
                'inventario_id' => [$inventario->codebar],
                'product_id' => [$inventario->product_id],
                'action' => 'Inventario actualizado',
                'description' => $log,
                'note' => ''
            ]);
            $inventario->save();
            
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            dd($e->getMessage());
            return Redirect::back()->with('error', 'Error al actualizar el inventario.');
        }
        return Redirect::back()->with('success', 'Inventario actualizado correctamente.');
    }

    

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Inventario  $inventario
     * @return \Illuminate\Http\Response
     */
    public function show(Inventario $inventario)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Inventario  $inventario
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $product = Product::find($id);
        return Inertia::render('Inventories/Edit', [
            'filters' => Request::all('search', 'trashed'),
            'inventario' => Inventario::where('product_id', $id)->orderBy('status', 'asc')->get(),
            'product' => new ProductResource($product),
            'categorias'=> Category::All(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Inventario  $inventario
     * @return \Illuminate\Http\Response
     */
    public function update(HttpRequest $request)
    {
        DB::beginTransaction();
        try {
            $inventario = Inventario::find($request->id);
            $log = 'El usuario '.Auth::user()->first_name.' '.Auth::user()->last_name.' actualizo el estado del producto '.$inventario->product->name.' bajo el codigo '.$inventario->codebar.' de '.$inventario->status.' a '.$request->status;

            $inventario->update($request->all());
            $inventario->save();

            $registroLogNewInventory = Registro::create([
                'user_id' => Auth::user()->id,
                'organization_id' => Auth::user()->organization_id,
                'module' => 'Inventario',
                'inventario_id' => [$inventario->codebar],
                'product_id' => [$inventario->product_id],
                'action' => 'Inventario actualizado',
                'description' => $log,
                'note' => ''
            ]);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            dd($e->getMessage());
            return Redirect::back()->with('error', 'Error al actualizar el inventario.');
        }
        // $eliminar = Inventario::find($request->id)->update(['status'=>$request->status]);
        return Redirect::back()->with('success', 'Editado con éxito');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Inventario  $inventario
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            $inventario = Inventario::find($id);
            $log = 'El usuario '.Auth::user()->first_name.' '.Auth::user()->last_name.' elimino el inventario de '.$inventario->product->name.' bajo el codigo '.$inventario->codebar.' con la cantidad de '.$inventario->existencia; 
            
            if(isset($inventario->existenciaDividida)){
                $log .= ' en las tiendas: ';
                $existenciaDividida = json_decode($inventario->existenciaDividida);
                foreach ($existenciaDividida as $index => $original) {
                    $log .= $original->company_name.': '.$original->cantidad.'; ';
                }
            }


            $registroLogNewInventory = Registro::create([
                'user_id' => Auth::user()->id,
                'organization_id' => Auth::user()->organization_id,
                'module' => 'Inventario',
                'inventario_id' => [$inventario->codebar],
                'product_id' => [$inventario->product_id],
                'action' => 'Inventario eliminado',
                'description' => $log,
                'note' => ''
            ]);
            $inventario->delete();
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            dd($e->getMessage());
            return Redirect::back()->with('error', 'Error al eliminar el inventario.');
        }

        return Redirect::back()->with('success', 'Eliminado con éxito');
    }
}
