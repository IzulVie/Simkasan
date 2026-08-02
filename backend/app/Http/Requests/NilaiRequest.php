<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class NilaiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'santri_id' => ['required', 'exists:santris,id'],
            'mapel' => ['required', 'string', 'max:255'],
            'nilai' => ['required', 'integer', 'between:0,100'],
            'tanggal' => ['required', 'date'],
        ];
    }
}
