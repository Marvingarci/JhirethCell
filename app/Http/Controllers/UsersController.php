<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserDeleteRequest;
use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Http\Resources\UserCollection;
use App\Http\Resources\VentaCollection;
use App\Http\Resources\UserResource;
use App\Models\Organization;
use App\Models\User;
use App\Models\Ventas;
use Illuminate\Http\Request as HttpRequest;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Redirect;
use Spatie\Permission\Models\Permission;
use Carbon\Carbon;

class UsersController extends Controller
{
    public function index()
    {
        return Inertia::render('Users/Index', [
            'filters' => Request::all('search', 'role', 'trashed'),
            'users' => new UserCollection(
                Auth::user()->account->users()
                    ->with('permissions')
                    ->orderByName()
                    ->filter(Request::only('search', 'role', 'trashed'))
                    ->paginate()
                    ->appends(Request::all())
            ),
            'permissions' => Permission::all('id', 'name'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Users/Create', [
            'organizations' => Organization::all()
         ]);
    }

    public function store(UserStoreRequest $request)
    {
        Auth::user()->account->users()->create(
            $request->validated()
        );

        return Redirect::route('users')->with('success', 'User created.');
    }

    public function edit(User $user)
    {
        // I want to filter the VentaPorMeses and VentaCreditoPorMeses by the user id by month 
        // the created_at field is a timestamp with this format ex. 2024-09-02 16:01:05
        // $VentasPorMes = new VentaCollection(Ventas::where('vendedor_id', $user->id)
        //     ->where('tipoPago', '!=', 'credito')
        //     ->with('venta_detalles')
        //     ->orderBy('created_at', 'desc')
        //     ->filter(Request::only('search', 'month'))
        //     ->paginate()
        //     ->appends(Request::all())
        // );



        // $VentasCreditoPorMes = Ventas::where('vendedor_id', $user->id)
        // ->where('tipoPago', 'credito')
        // ->with('venta_detalles')
        // ->orderBy('created_at', 'desc')
        // ->get()
        // ->groupBy(function($val) {
        //     return Carbon::parse($val->created_at)->format('F Y');
        // });

        if (!Request::has('month')) {
            Request::merge(['month' => Carbon::now()->format('YYYY-MM')]);
        }
        
        return Inertia::render('Users/Edit', [
            'filters' => Request::all('search', 'month', 'date'),
            'user' => new UserResource($user),
            'VentasPorMes' => new VentaCollection(
                
                Ventas::where('vendedor_id', $user->id)
                ->where('tipoPago', '!=', 'credito')
                ->with('venta_detalles')
                ->orderBy('created_at', 'desc')
                ->filter(Request::only('search', 'month', 'date'))
                ->get()
            ),
            'VentasCreditoPorMes' => new VentaCollection(
                Ventas::where('vendedor_id', $user->id)
                ->where('tipoPago', 'credito')
                ->with('venta_detalles')
                ->orderBy('created_at', 'desc')
                ->filter(Request::only('search', 'month', 'date'))
                ->get()
            )
        ]);
    }

    public function update(User $user, UserUpdateRequest $request)
    {
        $user->update(
            $request->validated()
        );

        return Redirect::back()->with('success', 'User updated.');
    }

    public function destroy(User $user, UserDeleteRequest $request)
    {
        $user->delete();

        return Redirect::back()->with('success', 'User deleted.');
    }

    public function restore(User $user)
    {
        $user->restore();

        return Redirect::back()->with('success', 'User restored.');
    }

    public function assignPermissions(HttpRequest $request, User $user)
    {

        $request->validate([
            'permissions' => 'required',
        ]);

        $user->syncPermissions($request->permissions);

        return back()->with(["success" => "¡Permisos asignados con éxito!"]);
    }
}
