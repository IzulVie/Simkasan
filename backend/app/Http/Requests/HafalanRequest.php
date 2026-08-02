<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class HafalanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'santri_id' => ['required', 'exists:santris,id'],
            'tanggal' => ['required', 'date'],
            'juz' => ['required', 'integer', 'between:1,30'],
            'surah' => ['required', 'string', 'max:255'],
            'ayat_mulai' => ['required', 'integer', 'min:1'],
            'ayat_selesai' => ['required', 'integer', 'gte:ayat_mulai'],
            'nilai_kelancaran' => ['required', 'string', 'in:Mumtaz,Jayyid,Maqbul,Dhaif'],
            'nilai_tajwid' => ['required', 'string', 'in:Mumtaz,Jayyid,Maqbul,Dhaif'],
        ];
    }
}
