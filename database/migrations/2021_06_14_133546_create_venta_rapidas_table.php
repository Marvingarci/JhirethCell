<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVentaRapidasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('venta_rapidas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vendedor_id')->constrained('users')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->string('producto');
            $table->integer('cantidad');
            $table->float('precio', 8,2);
            $table->float('descuento');
            $table->string('total_producto');
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
        Schema::dropIfExists('venta_rapidas');
    }
}
