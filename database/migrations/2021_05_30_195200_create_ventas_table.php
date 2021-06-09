<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVentasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ventas', function (Blueprint $table) {
            $table->id();
            $table->integer('account_id')->index();
            $table->string('cliente');
            $table->foreignId('vendedor_id')->constrained('users')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->float('total', 8,2);
            $table->enum('tipoPago', ['efectivo', 'credito']);
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
        Schema::dropIfExists('ventas');
    }
}
