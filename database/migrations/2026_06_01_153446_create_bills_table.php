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
        Schema::create('bills', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('booking_id')->constrained();
            $table->enum('type', ['rent', 'water', 'electric', 'other']);
            $table->string('title');           // e.g. "Electric Bill – June 2025"
            $table->decimal('amount', 10, 2);
            $table->decimal('previous_reading', 10, 2)->nullable(); // for water/electric
            $table->decimal('current_reading', 10, 2)->nullable();
            $table->decimal('rate_used', 8, 4)->nullable();         // snapshot of rate at time of billing
            $table->date('bill_date');
            $table->date('due_date');
            $table->enum('status', ['unpaid', 'partial', 'paid', 'overdue'])->default('unpaid');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bills');
    }
};
