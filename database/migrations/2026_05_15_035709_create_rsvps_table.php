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
        Schema::create('rsvps', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('invitation_id');
            $table->string('guest_name');
            $table->enum('attendance', ['attending', 'not_attending']);
            $table->unsignedInteger('guest_count')->default(1);
            $table->text('wishes')->nullable();
            $table->text('qr_value')->nullable();
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
        Schema::dropIfExists('rsvps');
    }
};
