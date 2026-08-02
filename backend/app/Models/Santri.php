<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Santri extends Model
{
    use HasFactory;

    protected $table = 'santris';

    protected $fillable = [
        'nis',
        'nama',
        'kelas_id',
        'tanggal_lahir',
        'alamat',
        'foto',
    ];

    /**
     * Get the class of the santri.
     */
    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class, 'kelas_id');
    }

    /**
     * Get the wali santri (parents) associated with the santri.
     */
    public function walis(): BelongsToMany
    {
        return $this->belongsToMany(WaliSantri::class, 'wali_santri_santri', 'santri_id', 'wali_santri_id');
    }

    /**
     * Get the attendance records for the santri.
     */
    public function absensis(): HasMany
    {
        return $this->hasMany(Absensi::class, 'santri_id');
    }

    /**
     * Get the memorization records for the santri.
     */
    public function hafalans(): HasMany
    {
        return $this->hasMany(Hafalan::class, 'santri_id');
    }

    /**
     * Get the grades for the santri.
     */
    public function nilais(): HasMany
    {
        return $this->hasMany(Nilai::class, 'santri_id');
    }

    /**
     * Get the payment (iuran) records for the santri.
     */
    public function iurans(): HasMany
    {
        return $this->hasMany(Iuran::class, 'santri_id');
    }
}
