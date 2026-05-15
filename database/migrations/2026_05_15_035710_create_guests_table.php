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
        Schema::create('guests', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('invitation_id');
            $table->string('name');
            $table->string('phone_raw');
            $table->string('phone_normalized');
            $table->string('guest_key');
            $table->enum('send_status', ['pending', 'sending', 'sent', 'failed'])->default('pending');
            $table->timestamp('last_sent_at')->nullable();
            $table->text('last_error')->nullable();
            $table->string('provider_message_id')->nullable();
            $table->timestamps();

            $table->foreign('invitation_id')->references('id')->on('invitations')->cascadeOnDelete();
            $table->unique(['invitation_id', 'phone_normalized']);
            $table->unique(['invitation_id', 'guest_key']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guests');
    }
};
