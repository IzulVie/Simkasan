<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SantriResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nis' => $this->nis,
            'nama' => $this->nama,
            'kelas_id' => $this->kelas_id,
            'kelas' => $this->kelas ? [
                'id' => $this->kelas->id,
                'nama_kelas' => $this->kelas->nama_kelas,
                'tingkat' => $this->kelas->tingkat,
            ] : null,
            'tanggal_lahir' => $this->tanggal_lahir,
            'alamat' => $this->alamat,
            'foto' => $this->foto,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
