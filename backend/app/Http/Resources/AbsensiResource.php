<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AbsensiResource extends JsonResource
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
            'sesi' => $this->sesi,
            'status' => $this->status,
            'keterangan' => $this->keterangan,
            'dicatat_oleh' => $this->dicatat_oleh,
            'pencatat' => $this->pencatat ? [
                'id' => $this->pencatat->id,
                'name' => $this->pencatat->name,
            ] : null,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
