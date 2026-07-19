<?php

namespace App\Http\Requests\Deposit;

use Illuminate\Foundation\Http\FormRequest;

class StoreDepositRequest extends FormRequest
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
            'amount'    => ['required', 'numeric', 'min:0.01'],
            'type'      => ['required', 'in:received,applied,forfeited,refunded'],
            'paid_at'   => ['required', 'date'],
            'notes'     => ['nullable', 'string'],
        ];
    }
}
