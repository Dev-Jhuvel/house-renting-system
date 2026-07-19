<?php

namespace App\Http\Requests\Bill;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBillRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title'             => ['required', 'string'],
            'amount'            => ['required', 'numeric'],
            'previous_reading'  => ['nullable', 'numeric'],
            'current_reading'   => ['nullable', 'numeric', 'gt:previous_reading'],
            'rate_used'         => ['nullable', 'numeric'],
            'bill_date'         => ['required', 'date'],
            'due_date'          => ['required', 'date'],
            'notes'             => ['nullable', 'string'],
        ];
    }
}
