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
        Schema::create('absensis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('santri_id')->constrained('santris')->cascadeOnDelete();
            $table->date('tanggal');
            $table->string('sesi'); // pagi, siang, sore, malam, dst
            $table->string('status'); // hadir, izin, sakit, alpha, terlambat
            $table->text('keterangan')->nullable();
            $table->foreignId('dicatat_oleh')->constrained('users')->cascadeOnDelete();
            $table->timestamps();

            // Unique index to prevent duplicate attendance entry for a student, date, and session
            $table->unique(['santri_id', 'tanggal', 'sesi']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('absensis');
    }
};
