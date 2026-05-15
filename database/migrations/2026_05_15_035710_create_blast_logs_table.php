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
        Schema::create('blast_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('invitation_id');
            $table->uuid('triggered_by')->nullable();
            $table->string('mode');
            $table->unsignedInteger('total')->default(0);
            $table->unsignedInteger('success')->default(0);
            $table->unsignedInteger('failed')->default(0);
            $table->timestamps();

            $table->foreign('invitation_id')->references('id')->on('invitations')->cascadeOnDelete();
            $table->index(['invitation_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blast_logs');
    }
};
