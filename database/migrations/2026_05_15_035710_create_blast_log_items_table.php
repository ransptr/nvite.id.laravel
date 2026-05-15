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
        Schema::create('blast_log_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('blast_log_id');
            $table->uuid('guest_id');
            $table->string('status');
            $table->text('error')->nullable();
            $table->string('provider_message_id')->nullable();
            $table->timestamps();

            $table->index('blast_log_id');
            $table->index('guest_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blast_log_items');
    }
};
