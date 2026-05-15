<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ImportGuestsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'guests' => ['nullable', 'array', 'min:1'],
            'guests.*.name' => ['required', 'string', 'max:120'],
            'guests.*.phone_raw' => ['required', 'string', 'max:40'],
            'guests.*.phone_normalized' => ['required', 'string', 'max:40'],
            'guests.*.guest_key' => ['required', 'string', 'max:120'],
            'file' => ['nullable', 'file', 'mimes:csv,txt,xlsx,xls'],
        ];
    }
}
