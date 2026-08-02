<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IuranResource extends JsonResource
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
                'kelas' => $this->santri->kelas ? $this->santri->kelas->nama_kelas : 'Belum Ditentukan',
            ] : null,
            'bulan' => $this->bulan,
            'tahun' => $this->tahun,
            'status' => $this->status,
            'dikonfirmasi_oleh' => $this->dikonfirmasi_oleh,
            'konfirmator' => $this->konfirmator ? [
                'id' => $this->konfirmator->id,
                'name' => $this->konfirmator->name,
            ] : null,
            'tanggal_konfirmasi' => $this->tanggal_konfirmasi ? $this->tanggal_konfirmasi->toIso8601String() : null,
            'keterangan' => $this->keterangan,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
