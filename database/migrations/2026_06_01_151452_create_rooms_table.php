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
        Schema::create('rooms', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('house_id')->constrained()->cascadeOnDelete();
            $table->string('room_number');
            $table->string('floor')->default(1);
            $table->enum('type', ['single', 'double', 'studio', 'dormitory'])->default('single');
            $table->decimal('monthly_rent', 8, 4)->default(0);
            $table->integer('capacity');
            $table->enum('status', ['available', 'occupied', 'reserved', 'maintenance'])->default('available');
            $table->string('description')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->unique(['house_id', 'room_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
