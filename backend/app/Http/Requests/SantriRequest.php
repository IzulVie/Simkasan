<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SantriRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $santriId = $this->route('santri') ? $this->route('santri')->id : null;

        return [
            'nis' => [
                'required',
                'string',
                'max:50',
                Rule::unique('santris', 'nis')->ignore($santriId),
            ],
            'nama' => ['required', 'string', 'max:255'],
            'kelas_id' => ['required', 'exists:kelas,id'],
            'tanggal_lahir' => ['nullable', 'date'],
            'alamat' => ['nullable', 'string'],
            'foto' => ['nullable', 'string'],
        ];
    }
}
