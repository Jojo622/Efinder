<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('type');
            $table->string('status');
            $table->decimal('monthly_rent', 12, 2)->nullable();
            $table->decimal('security_deposit', 12, 2)->nullable();
            $table->string('location')->nullable();
            $table->string('street_address');
            $table->string('city');
            $table->string('barangay');
            $table->string('bedrooms')->nullable();
            $table->string('bathrooms')->nullable();
            $table->string('square_footage')->nullable();
            $table->string('parking_spaces')->nullable();
            $table->date('availability_date')->nullable();
            $table->string('lease_term')->nullable();
            $table->string('contact_name')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('contact_phone')->nullable();
            $table->text('amenities')->nullable();
            $table->text('description')->nullable();
            $table->string('hero_image')->nullable();
            $table->text('gallery_images')->nullable();
            $table->text('pet_policy')->nullable();
            $table->text('notes')->nullable();
            $table->string('availability_photo_path')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
