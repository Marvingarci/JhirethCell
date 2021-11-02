<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->integer('account_id')->index();
            $table->string('name', 50);
            $table->foreignId('category_id')->constrained('categories')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->string('color')->default('Indefinido');
            $table->float('cost_price', 8, 2);
            $table->float('sell_price', 8, 2);
            $table->float('whole_sell_price', 8, 2);
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
        Schema::dropIfExists('products');
    }
}
