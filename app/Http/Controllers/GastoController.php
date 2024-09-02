<?php

namespace App\Http\Controllers;

use App\Models\Gasto;
use App\Models\Organization;
use App\Http\Requests\StoreGastoRequest;
use App\Http\Requests\UpdateGastoRequest;
use App\Http\Resources\GastoCollection;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use App\Models\Registro;
use Illuminate\Support\Facades\DB;

class GastoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $organizations = Organization::all();
        return Inertia::render('Gastos/Index', [
            'filters' => Request::all('search', 'date', 'organization'),
            'gastos' => new GastoCollection(
                Gasto::
                    orderBy('created_at')
                    ->where('organization_id', auth()->user()->organization_id)
                    ->filter(Request::only('search', 'date', 'organization'))
                    ->paginate()
                    ->appends(Request::all())
            ),
            'organizations' => $organizations
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return Inertia::render('Gastos/Create', [
            'organizations' => Organization::all()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreGastoRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreGastoRequest $request)
    {

        DB::beginTransaction();

        try{

            Gasto::create(
                $request->validated()
            );
            $RegistroLogGasto = Registro::create([
                'user_id' => auth()->user()->id,
                'organization_id' => auth()->user()->organization_id,
                'module' => 'Gastos',
                'action' => 'Crear Gasto',
                'description' => 'El usuario '.auth()->user()->first_name.' '.auth()->user()->last_name.' creo el gasto '.$request->title.' / '.$request->description.' por un monto de L '.$request->total.' en la organizacion '.auth()->user()->organization->name,
                'note' => 'Gasto creado'
            ]);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            dd($e->getMessage());
            return Redirect::route('gastos.create')->with('error', 'Error al crear el gasto.');
        }


        return Redirect::route('gastos')->with('success', 'Gasto creado.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Gasto  $gasto
     * @return \Illuminate\Http\Response
     */
    public function show(Gasto $gasto)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Gasto  $gasto
     * @return \Illuminate\Http\Response
     */
    public function edit(Gasto $gasto)
    {
        return Inertia::render('Gastos/Edit', [
            'gasto' => $gasto,
            'organizations' => Organization::all()
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateGastoRequest  $request
     * @param  \App\Models\Gasto  $gasto
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateGastoRequest $request, Gasto $gasto)
    {

        DB::beginTransaction();
        try{
            $gasto->update(
                $request->validated()
            );

            $RegistroLogGasto = Registro::create([
                'user_id' => auth()->user()->id,
                'organization_id' => auth()->user()->organization_id,
                'module' => 'Gastos',
                'action' => 'Actualizar Gasto',
                'description' => 'El usuario '.auth()->user()->first_name.' '.auth()->user()->last_name.' actualizo el gasto '.$gasto->title.' / '.$gasto->description.' por un monto de L '.$gasto->total.' en la organizacion '.auth()->user()->organization->name,
                'note' => 'Gasto actualizado'
            ]);
    
           

            DB::commit();
        }   catch (\Exception $e) {
            DB::rollBack();
            dd($e->getMessage());
            return Redirect::route('gastos.edit', $gasto)->with('error', 'Error al actualizar el gasto.');
        }


        return Redirect::route('gastos.edit', $gasto)->with('success', 'Gasto actualizado.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Gasto  $gasto
     * @return \Illuminate\Http\Response
     */
    public function destroy(Gasto $gasto)
    {

        DB::beginTransaction();
        try{
            $gasto->delete();

            $RegistroLogGasto = Registro::create([
                'user_id' => auth()->user()->id,
                'organization_id' => auth()->user()->organization_id,
                'module' => 'Gastos',
                'action' => 'Eliminar Gasto',
                'description' => 'El usuario '.auth()->user()->first_name.' '.auth()->user()->last_name.' elimino el gasto '.$gasto->title.' / '.$gasto->description.' por un monto de L '.$gasto->total.' en la organizacion '.auth()->user()->organization->name,
                'note' => 'Gasto eliminado'
            ]);

            DB::commit();

        }catch (\Exception $e) {
            DB::rollBack();
            dd($e->getMessage());
            return Redirect::route('gastos')->with('error', 'Error al eliminar el gasto.');
        }


        return Redirect::route('gastos')->with('success', 'Gasto eliminado.');
    }
}
