<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AbsensiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tanggal' => ['required', 'date'],
            'sesi' => ['required', 'string', 'max:50'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.santri_id' => ['required', 'exists:santris,id'],
            'items.*.status' => ['required', 'string', 'in:hadir,izin,sakit,alpha,terlambat'],
            'items.*.keterangan' => ['nullable', 'string'],
        ];
    }
}
