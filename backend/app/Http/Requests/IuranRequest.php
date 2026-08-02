<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class IuranRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        if ($this->isMethod('post')) {
            return [
                'bulan' => ['required', 'integer', 'between:1,12'],
                'tahun' => ['required', 'integer', 'min:2000', 'max:2100'],
                'kelas_id' => ['nullable', 'exists:kelas,id'],
            ];
        }

        return [
            'keterangan' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
