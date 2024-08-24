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
            'filters' => Request::all('search', 'trashed'),
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
        Gasto::create(
            $request->validated()
        );

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
        $gasto->update(
            $request->validated()
        );

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
        $gasto->delete();

        return Redirect::route('gastos')->with('success', 'Gasto eliminado.');
    }
}
