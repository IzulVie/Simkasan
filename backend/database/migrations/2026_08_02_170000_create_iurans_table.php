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
        Schema::create('iurans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('santri_id')->constrained('santris')->cascadeOnDelete();
            $table->integer('bulan');
            $table->integer('tahun');
            $table->string('status')->default('belum_lunas'); // lunas, belum_lunas
            $table->foreignId('dikonfirmasi_oleh')->nullable()->constrained('users')->nullOnDelete();
            $table->dateTime('tanggal_konfirmasi')->nullable();
            $table->text('keterangan')->nullable();
            $table->timestamps();

            // Unique constraint to prevent duplicate payments for the same month/year per student
            $table->unique(['santri_id', 'bulan', 'tahun']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('iurans');
    }
};
