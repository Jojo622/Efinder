<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('units', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained('properties')->cascadeOnDelete();
            $table->integer('bed')->nullable();
            $table->integer('bath')->nullable();
            $table->integer('floor_area')->nullable();
            $table->decimal('rent', 10, 2)->nullable();
            $table->decimal('deposits', 10, 2)->nullable();
            $table->text('policies')->nullable();
            $table->boolean('availability')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('units');
    }
};

