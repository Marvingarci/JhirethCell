<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Requests\ProductStoreRequest;
use App\Http\Requests\ProductUpdateRequest;
use App\Http\Resources\ProductCollection;
use App\Http\Resources\ProductResource;
use Inertia\Inertia;
use App\Models\Organization;
use App\Models\Category;
use App\Models\Inventario;
use App\Models\Registro;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Redirect;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        // $realExistencia = Product::select('id', 'dbType')->get();
        
        $pre = new ProductCollection(
            Auth::user()->account->products()
                ->orderBy('name')
                ->filter(Request::only('search', 'trashed'))
                ->paginate()
                ->appends(Request::all())
        );


        return Inertia::render('Products/Index', [
            'filters' => Request::all('search', 'trashed'),
            // 'realExistencia' => $realExistencia,
            'products' => $pre,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return Inertia::render('Products/Create', [
            'categorias' => Category::all()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ProductStoreRequest $request)
    {
        DB::beginTransaction();
        try {
            Auth::user()->account->products()->create(
                $request->validated()
            );

            $registroLogNewProduct = Registro::create([
                'user_id' => Auth::user()->id,
                'organization_id' => Auth::user()->organization_id,
                'module' => 'Productos',
                'product_id' => [Product::latest()->first()->id],
                'action' => 'Agregar Producto',
                'description' => 'El usuario ' . Auth::user()->name . ' agrego un producto nuevo llamado ' . Product::latest()->first()->name . ' con id ' . Product::latest()->first()->id
                . ' con un precio de mayorista de L ' . Product::latest()->first()->whole_sell_price . ' y un precio de venta al publico de L ' . Product::latest()->first()->sell_price . ', ',
                'note' => ''
            ]);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return Redirect::back()->with('error', 'Error al agregar producto.');
        }

        return Redirect::route('products')->with('success', 'Producto agregado.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {

        $product = Product::find($id);
        return Inertia::render('Products/Edit', [
            'product' => new ProductResource($product),
            'categorias'=> Category::All()
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function update(ProductUpdateRequest $request)
    {

        DB::beginTransaction();

        try{

            $product = Product::find($request->id);
            $product->name = $request->name;
            $product->sell_price = $request->sell_price;
            $product->cost_price = $request->cost_price;
            $product->whole_sell_price = $request->whole_sell_price;
            $product->dbType = $request->dbType;
            $product->color = $request->color;
            $product->category_id = $request->category_id;

            $dirty = $product->getDirty();
            $log = 'El usuario ' . Auth::user()->name . ' edito el producto ' . $product->name . ' con id ' . $product->id . ' cambiando los siguientes campos: ';
            foreach ($dirty as $key => $value) {
                $log .= $key . ' de ' . $product->getOriginal($key) . ' a ' . $value . ', ';
            }
            
            $product->save();
            $registroLogUpdateProduct = Registro::create([
                'user_id' => Auth::user()->id,
                'organization_id' => Auth::user()->organization_id,
                'module' => 'Productos',
                'product_id' => [$product->id],
                'action' => 'Editar Producto',
                'description' => $log,
                'note' => ''
            ]);

    
            DB::commit();
        }catch(\Exception $e){
            DB::rollBack();
            return Redirect::back()->with('error', 'Error al editar producto.');
        }

        return Redirect::back()->with('success', 'Producto Editado.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {   
        DB::beginTransaction();
        try{
            $product = Product::find($id);
            $product->delete();

            $registroLogDeleteProduct = Registro::create([
                'user_id' => Auth::user()->id,
                'organization_id' => Auth::user()->organization_id,
                'module' => 'Productos',
                'product_id' => [$product->id],
                'action' => 'Eliminar Producto',
                'description' => 'El usuario ' . Auth::user()->name . ' elimino el producto ' . $product->name . ' con id ' . $product->id . ' con un precio de mayorista de L ' . $product->whole_sell_price . ' y un precio de venta al publico de L ' . $product->sell_price . ', ',
                'note' => ''
            ]);

            DB::commit();
        }catch(\Exception $e){
            DB::rollBack();
            return Redirect::back()->with('error', 'Error al eliminar producto.');
        }

        return Redirect::route('products')->with('success', 'Producto borrado.');
    }
}
