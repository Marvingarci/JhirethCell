<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInventariosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('inventarios', function (Blueprint $table) {
            $table->id();
            $table->integer('account_id')->index();
            $table->foreignId('product_id')->constrained('products')
            ->onUpdate('cascade')
            ->onDelete('cascade');
            $table->string('codebar')->unique();
            $table->string('imei')->unique();
            $table->enum('status', ['stock', 'vendido', 'pendiente']);
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
        Schema::dropIfExists('inventarios');
    }
}
