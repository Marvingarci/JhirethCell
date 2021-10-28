<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Auth

use App\Http\Controllers\UsersController;
use Illuminate\Support\Facades\Route;

Route::get('login')->name('login')->uses('Auth\LoginController@showLoginForm')->middleware('guest');
Route::post('login')->name('login.attempt')->uses('Auth\LoginController@login')->middleware('guest');
Route::post('logout')->name('logout')->uses('Auth\LoginController@logout');

// Dashboard
Route::get('/')->name('dashboard')->uses('DashboardController')->middleware('auth');

// Users
Route::get('users')->name('users')->uses('UsersController@index')->middleware('remember', 'permission:Usuarios');
Route::get('users/create')->name('users.create')->uses('UsersController@create')->middleware('permission:Usuarios');
Route::post('users')->name('users.store')->uses('UsersController@store')->middleware('permission:Usuarios');
Route::get('users/{user}/edit')->name('users.edit')->uses('UsersController@edit')->middleware('permission:Usuarios');
Route::put('users/{user}')->name('users.update')->uses('UsersController@update')->middleware('permission:Usuarios');
Route::delete('users/{user}')->name('users.destroy')->uses('UsersController@destroy')->middleware('permission:Usuarios');
Route::put('users/{user}/restore')->name('users.restore')->uses('UsersController@restore')->middleware('permission:Usuarios');
Route::post('assign-permissions/{user}')->name('permisos.assign')->uses('UsersController@assignPermissions')
    ->middleware('permission:Usuarios');
            

// Images
Route::get('/img/{path}', 'ImagesController@show')->where('path', '.*');

// Organizations
Route::get('organizations')->name('organizations')->uses('OrganizationsController@index')->middleware('remember', 'auth');
Route::get('organizations/create')->name('organizations.create')->uses('OrganizationsController@create')->middleware('auth');
Route::post('organizations')->name('organizations.store')->uses('OrganizationsController@store')->middleware('auth');
Route::get('organizations/{organization}/edit')->name('organizations.edit')->uses('OrganizationsController@edit')->middleware('auth');
Route::put('organizations/{organization}')->name('organizations.update')->uses('OrganizationsController@update')->middleware('auth');
Route::delete('organizations/{organization}')->name('organizations.destroy')->uses('OrganizationsController@destroy')->middleware('auth');
Route::put('organizations/{organization}/restore')->name('organizations.restore')->uses('OrganizationsController@restore')->middleware('auth');

// Contacts
Route::get('contacts')->name('contacts')->uses('ContactsController@index')->middleware('remember', 'auth');
Route::get('contacts/create')->name('contacts.create')->uses('ContactsController@create')->middleware('auth');
Route::post('contacts')->name('contacts.store')->uses('ContactsController@store')->middleware('auth');
Route::get('contacts/{contact}/edit')->name('contacts.edit')->uses('ContactsController@edit')->middleware('auth');
Route::put('contacts/{contact}')->name('contacts.update')->uses('ContactsController@update')->middleware('auth');
Route::delete('contacts/{contact}')->name('contacts.destroy')->uses('ContactsController@destroy')->middleware('auth');
Route::put('contacts/{contact}/restore')->name('contacts.restore')->uses('ContactsController@restore')->middleware('auth');

// Reports
Route::get('reports')->name('reports')->uses('ReportsController')->middleware('auth');
Route::get('reports/diarios')->name('reports.diarios')->uses('ReportsController@dailyReport')->middleware('auth');
Route::get('reports/creditos')->name('reports.creditos')->uses('ReportsController@creditReport')->middleware('auth');
Route::get('reports/separados')->name('reports.divididos')->uses('ReportsController@separateReport')->middleware('auth');
Route::post('reports/separadosPorDia')->name('reports.divididosPorDia')->uses('ReportsController@separateReportByDay')->middleware('auth');


// 500 error


//Products
Route::get('products')->name('products')->uses('ProductController@index')->middleware('remember', 'auth');
Route::get('products/create')->name('products.create')->uses('ProductController@create')->middleware('auth');
Route::post('products')->name('products.store')->uses('ProductController@store')->middleware('auth');
Route::get('products/{contact}/edit')->name('products.edit')->uses('ProductController@edit')->middleware('auth');
Route::put('products/{contact}')->name('products.update')->uses('ProductController@update')->middleware('auth');
Route::delete('products/{contact}')->name('products.destroy')->uses('ProductController@destroy')->middleware('auth');
Route::put('products/{contact}/restore')->name('products.restore')->uses('ProductController@restore')->middleware('auth');

//Ventas
Route::get('ventas')->name('ventas')->uses('VentasController@index')->middleware('remember', 'permission:Caja');
Route::get('ventas/ventas_rapidas')->name('ventas_rapidas')->uses('VentasController@ventas_rapidas')->middleware('remember', 'permission:Caja');
Route::get('ventas/create')->name('ventas.create')->uses('VentasController@create')->middleware('permission:Caja');
Route::post('ventas')->name('ventas.store')->uses('VentasController@store')->middleware('permission:Caja');
Route::get('ventas/{venta}/edit')->name('ventas.edit')->uses('VentasController@edit')->middleware('permission:Caja');
Route::put('ventas/{venta}')->name('ventas.actualizar')->uses('VentasController@update')->middleware('permission:Caja');
Route::put('ventasfast/{venta}')->name('ventas.actualizarfast')->uses('VentasController@updateFast')->middleware('permission:Caja');
Route::put('ventaToDestroy/{venta}')->name('ventas.destroy')->uses('VentasController@destroy')->middleware('permission:Caja');
Route::put('ventas/{venta}/restore')->name('ventas.restore')->uses('VentasController@restore')->middleware('permission:Caja');

//Ventas_Rapida
Route::get('ventasR')->name('ventas_rapidas')->uses('VentaRapidaController@index')->middleware('remember', 'permission:Caja Rapida');
Route::get('ventasR/create')->name('ventas_rapidas.create')->uses('VentaRapidaController@create')->middleware('permission:Caja Rapida');
Route::post('ventasR')->name('ventas_rapidas.store')->uses('VentaRapidaController@store')->middleware('permission:Caja Rapida');
Route::get('ventasR/{venta}/edit')->name('ventas_rapidas.edit')->uses('VentaRapidaController@edit')->middleware('permission:Caja Rapida');
Route::put('ventasR/{venta}')->name('ventas_rapidas.update')->uses('VentaRapidaController@update')->middleware('permission:Caja Rapida');
Route::delete('ventasR/{venta}')->name('ventas_rapidas.destroy')->uses('VentaRapidaController@destroy')->middleware('permission:Caja Rapida');
Route::put('ventasR/{venta}/restore')->name('ventas_rapidas.restore')->uses('VentaRapidaController@restore')->middleware('permission:Caja Rapida');

//Garantias
Route::get('ver-garantias')->name('garantias')->uses('VentaRapidaController@verGarantias')->middleware('remember', 'auth');

//Servicios
//Products
Route::get('servicios')->name('servicios')->uses('ServiciosController@index')->middleware('remember', 'permission:Inventario');
Route::get('servicios/create')->name('servicios.create')->uses('ServiciosController@create')->middleware('permission:Inventario');
Route::post('servicios')->name('servicios.store')->uses('ServiciosController@store')->middleware('permission:Inventario');
Route::get('servicios/{contact}/edit')->name('servicios.edit')->uses('ServiciosController@edit')->middleware('permission:Inventario');
Route::put('servicios/{contact}')->name('servicios.update')->uses('ServiciosController@update')->middleware('permission:Inventario');
Route::delete('servicios/{contact}')->name('servicios.destroy')->uses('ServiciosController@destroy')->middleware('permission:Inventario');
Route::put('servicios/{contact}/restore')->name('servicios.restore')->uses('ServiciosController@restore')->middleware('permission:Inventario');

//Inventarios
Route::get('inventario')->name('inventario')->uses('InventarioController@index')->middleware('remember', 'auth');
Route::get('buscar-inventario')->name('buscar-inventario')->uses('InventarioController@buscarProducto')->middleware('remember', 'auth');
Route::get('inventario/create')->name('inventario.create')->uses('InventarioController@create')->middleware('auth');
Route::post('inventario')->name('inventario.store')->uses('InventarioController@store')->middleware('auth');
Route::get('inventario/{contact}/edit')->name('inventario.edit')->uses('InventarioController@edit')->middleware('auth');
Route::put('inventario/{contact}')->name('inventario.update')->uses('InventarioController@update')->middleware('auth');
Route::delete('inventario/{id}')->name('inventario.destroy')->uses('InventarioController@destroy')->middleware('auth');
Route::put('inventario/{contact}/restore')->name('inventario.restore')->uses('InventarioController@restore')->middleware('auth');







