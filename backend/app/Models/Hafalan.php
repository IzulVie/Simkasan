<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Hafalan extends Model
{
    use HasFactory;

    protected $table = 'hafalans';

    protected $fillable = [
        'santri_id',
        'tanggal',
        'juz',
        'surah',
        'ayat_mulai',
        'ayat_selesai',
        'nilai_kelancaran',
        'nilai_tajwid',
        'ustadz_id',
    ];

    /**
     * Get the santri associated with this memorization record.
     */
    public function santri(): BelongsTo
    {
        return $this->belongsTo(Santri::class, 'santri_id');
    }

    /**
     * Get the ustadz (teacher) who received this setoran.
     */
    public function ustadz(): BelongsTo
    {
        return $this->belongsTo(User::class, 'ustadz_id');
    }
}
