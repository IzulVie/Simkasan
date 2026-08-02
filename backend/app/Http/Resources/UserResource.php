<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'roles' => $this->roles->pluck('name'),
            'permissions' => $this->getAllPermissions()->pluck('name'),
            'santris' => $this->hasRole('wali') && $this->waliProfile ? $this->waliProfile->santris->map(function ($santri) {
                return [
                    'id' => $santri->id,
                    'nis' => $santri->nis,
                    'nama' => $santri->nama,
                    'kelas' => $santri->kelas ? $santri->kelas->nama_kelas : 'Belum Ditentukan',
                ];
            }) : null,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
