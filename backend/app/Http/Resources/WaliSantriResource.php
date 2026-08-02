<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WaliSantriResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'email' => $this->user ? $this->user->email : null,
            'nama' => $this->nama,
            'no_hp' => $this->no_hp,
            'santris' => $this->santris->map(function ($santri) {
                return [
                    'id' => $santri->id,
                    'nis' => $santri->nis,
                    'nama' => $santri->nama,
                ];
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
