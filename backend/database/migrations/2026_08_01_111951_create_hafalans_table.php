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
        Schema::create('hafalans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('santri_id')->constrained('santris')->cascadeOnDelete();
            $table->date('tanggal');
            $table->integer('juz');
            $table->string('surah');
            $table->integer('ayat_mulai');
            $table->integer('ayat_selesai');
            $table->string('nilai_kelancaran'); // Mumtaz, Jayyid, Maqbul, Dhaif
            $table->string('nilai_tajwid'); // Mumtaz, Jayyid, Maqbul, Dhaif
            $table->foreignId('ustadz_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hafalans');
    }
};
