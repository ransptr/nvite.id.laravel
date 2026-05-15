<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreRsvpRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'guest_name' => ['required', 'string', 'max:120'],
            'attendance' => ['required', 'in:attending,not_attending'],
            'guest_count' => ['nullable', 'integer', 'min:0', 'max:20'],
            'wishes' => ['nullable', 'string', 'max:2000'],
            'qr_value' => ['nullable', 'string', 'max:255'],
        ];
    }
}
