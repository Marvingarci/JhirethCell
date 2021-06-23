<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVentaDetallesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('venta_detalles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ventas_id')->constrained('ventas')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->string('product_id');
            $table->string('producto');
            $table->string('product_code');
            $table->integer('cantidad');
            $table->float('precio', 8,2);
            $table->float('descuento');
            $table->string('total_producto');
            $table->string('garantia');
            $table->date('fin_garantia');
            $table->enum('estado', ['efectivo', ' en_stock', 'devuelto', 'credito', 'pendiente']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('venta_detalles');
    }
}
