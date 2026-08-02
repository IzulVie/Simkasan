<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HafalanResource extends JsonResource
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
            'tanggal' => $this->tanggal,
            'juz' => $this->juz,
            'surah' => $this->surah,
            'ayat_mulai' => $this->ayat_mulai,
            'ayat_selesai' => $this->ayat_selesai,
            'nilai_kelancaran' => $this->nilai_kelancaran,
            'nilai_tajwid' => $this->nilai_tajwid,
            'ustadz_id' => $this->ustadz_id,
            'ustadz' => $this->ustadz ? [
                'id' => $this->ustadz->id,
                'name' => $this->ustadz->name,
            ] : null,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
