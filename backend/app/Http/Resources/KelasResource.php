<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class KelasResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nama_kelas' => $this->nama_kelas,
            'tingkat' => $this->tingkat,
            'santris_count' => $this->whenCounted('santris'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
