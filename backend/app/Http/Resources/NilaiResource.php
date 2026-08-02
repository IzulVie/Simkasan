<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NilaiResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'santri_id' => $this->santri_id,
            'santri' => $this->santri ? [
                'id' => $this->santri->id,
                'nis' => $this->santri->nis,
                'nama' => $this->santri->nama,
            ] : null,
            'mapel' => $this->mapel,
            'nilai' => $this->nilai,
            'ustadz_id' => $this->ustadz_id,
            'ustadz' => $this->ustadz ? [
                'id' => $this->ustadz->id,
                'name' => $this->ustadz->name,
            ] : null,
            'tanggal' => $this->tanggal,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
