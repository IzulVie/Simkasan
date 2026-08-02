<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class KegiatanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama_kegiatan' => ['required', 'string', 'max:255'],
            'tanggal' => ['required', 'date'],
            'waktu' => ['required', 'string', 'max:100'],
            'deskripsi' => ['nullable', 'string'],
        ];
    }
}
