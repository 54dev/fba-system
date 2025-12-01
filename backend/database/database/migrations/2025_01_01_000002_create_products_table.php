<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('operator_id')->constrained('users');
            $table->string('image_path');
            $table->string('ref_link1');
            $table->string('ref_link2')->nullable();
            $table->string('ref_link3')->nullable();
            $table->text('reason');
            $table->text('differentiation');
            $table->string('review_status')->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
