<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Iuran extends Model
{
    use HasFactory;

    protected $table = 'iurans';

    protected $fillable = [
        'santri_id',
        'bulan',
        'tahun',
        'status',
        'dikonfirmasi_oleh',
        'tanggal_konfirmasi',
        'keterangan',
    ];

    protected $casts = [
        'tanggal_konfirmasi' => 'datetime',
        'bulan' => 'integer',
        'tahun' => 'integer',
    ];

    /**
     * Get the santri associated with this payment record.
     */
    public function santri(): BelongsTo
    {
        return $this->belongsTo(Santri::class, 'santri_id');
    }

    /**
     * Get the admin who confirmed this payment.
     */
    public function konfirmator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dikonfirmasi_oleh');
    }
}
