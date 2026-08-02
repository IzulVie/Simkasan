<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class WaliSantri extends Model
{
    use HasFactory;

    protected $table = 'wali_santris';

    protected $fillable = [
        'user_id',
        'nama',
        'no_hp',
    ];

    /**
     * Get the user account associated with the wali santri.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the santris (children) associated with this parent.
     */
    public function santris(): BelongsToMany
    {
        return $this->belongsToMany(Santri::class, 'wali_santri_santri', 'wali_santri_id', 'santri_id');
    }
}
