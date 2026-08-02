<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class WaliSantriRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $wali = $this->route('wali_santri');
        $userId = $wali ? $wali->user_id : null;

        return [
            'nama' => ['required', 'string', 'max:255'],
            'no_hp' => ['required', 'string', 'max:20'],
            'email' => [
                $wali ? 'nullable' : 'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($userId),
            ],
            'password' => [$wali ? 'nullable' : 'required', 'string', 'min:8'],
            'santri_ids' => ['nullable', 'array'],
            'santri_ids.*' => ['exists:santris,id'],
        ];
    }
}
