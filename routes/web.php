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

use Illuminate\Support\Facades\Route;

Route::get('login')->name('login')->uses('Auth\LoginController@showLoginForm')->middleware('guest');
Route::post('login')->name('login.attempt')->uses('Auth\LoginController@login')->middleware('guest');
Route::post('logout')->name('logout')->uses('Auth\LoginController@logout');

// Dashboard
Route::get('/')->name('dashboard')->uses('DashboardController')->middleware('auth');

// Users
Route::get('users')->name('users')->uses('UsersController@index')->middleware('remember', 'auth');
Route::get('users/create')->name('users.create')->uses('UsersController@create')->middleware('auth');
Route::post('users')->name('users.store')->uses('UsersController@store')->middleware('auth');
Route::get('users/{user}/edit')->name('users.edit')->uses('UsersController@edit')->middleware('auth');
Route::put('users/{user}')->name('users.update')->uses('UsersController@update')->middleware('auth');
Route::delete('users/{user}')->name('users.destroy')->uses('UsersController@destroy')->middleware('auth');
Route::put('users/{user}/restore')->name('users.restore')->uses('UsersController@restore')->middleware('auth');

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

// 500 error
Route::get('500', function () {
    echo $fail;
});

//Products
Route::get('products')->name('products')->uses('ProductController@index')->middleware('remember', 'auth');
Route::get('products/create')->name('products.create')->uses('ProductController@create')->middleware('auth');
Route::post('products')->name('products.store')->uses('ProductController@store')->middleware('auth');
Route::get('products/{contact}/edit')->name('products.edit')->uses('ProductController@edit')->middleware('auth');
Route::put('products/{contact}')->name('products.update')->uses('ProductController@update')->middleware('auth');
Route::delete('products/{contact}')->name('products.destroy')->uses('ProductController@destroy')->middleware('auth');
Route::put('products/{contact}/restore')->name('products.restore')->uses('ProductController@restore')->middleware('auth');

//Ventas

Route::get('ventas')->name('ventas')->uses('VentasController@index')->middleware('remember', 'auth');
Route::get('ventas/ventas_rapidas')->name('ventas_rapidas')->uses('VentasController@ventas_rapidas')->middleware('remember', 'auth');
Route::get('ventas/create')->name('ventas.create')->uses('VentasController@create')->middleware('auth');
Route::post('ventas')->name('ventas.store')->uses('VentasController@store')->middleware('auth');
Route::get('ventas/{venta}/edit')->name('ventas.edit')->uses('VentasController@edit')->middleware('auth');
Route::put('ventas/{venta}')->name('ventas.actualizar')->uses('VentasController@update')->middleware('auth');
Route::put('ventaToDestroy/{venta}')->name('ventas.destroy')->uses('VentasController@destroy')->middleware('auth');
Route::put('ventas/{venta}/restore')->name('ventas.restore')->uses('VentasController@restore')->middleware('auth');

//Ventas_Rapida
Route::get('ventasR')->name('ventas_rapidas')->uses('VentaRapidaController@index')->middleware('remember', 'auth');
Route::get('ventasR/create')->name('ventas_rapidas.create')->uses('VentaRapidaController@create')->middleware('auth');
Route::post('ventasR')->name('ventas_rapidas.store')->uses('VentaRapidaController@store')->middleware('auth');
Route::get('ventasR/{venta}/edit')->name('ventas_rapidas.edit')->uses('VentaRapidaController@edit')->middleware('auth');
Route::put('ventasR/{venta}')->name('ventas_rapidas.update')->uses('VentaRapidaController@update')->middleware('auth');
Route::delete('ventasR/{venta}')->name('ventas_rapidas.destroy')->uses('VentaRapidaController@destroy')->middleware('auth');
Route::put('ventasR/{venta}/restore')->name('ventas_rapidas.restore')->uses('VentaRapidaController@restore')->middleware('auth');

//Garantias
Route::get('ver-garantias')->name('garantias')->uses('VentaRapidaController@verGarantias')->middleware('remember', 'auth');

//Servicios
//Products
Route::get('servicios')->name('servicios')->uses('ServiciosController@index')->middleware('remember', 'auth');
Route::get('servicios/create')->name('servicios.create')->uses('ServiciosController@create')->middleware('auth');
Route::post('servicios')->name('servicios.store')->uses('ServiciosController@store')->middleware('auth');
Route::get('servicios/{contact}/edit')->name('servicios.edit')->uses('ServiciosController@edit')->middleware('auth');
Route::put('servicios/{contact}')->name('servicios.update')->uses('ServiciosController@update')->middleware('auth');
Route::delete('servicios/{contact}')->name('servicios.destroy')->uses('ServiciosController@destroy')->middleware('auth');
Route::put('servicios/{contact}/restore')->name('servicios.restore')->uses('ServiciosController@restore')->middleware('auth');








