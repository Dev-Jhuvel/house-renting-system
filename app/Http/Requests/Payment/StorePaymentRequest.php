<?php

namespace App\Http\Requests\Payment;

use Illuminate\Foundation\Http\FormRequest;

class StorePaymentRequest extends FormRequest
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
        $bill = $this->route('bill');
        return [
            'amount_paid'      => ['required', 'numeric', 'min:0.01', 'max:'.$bill->remaining_balance],
            'paid_at'          => ['required', 'date'] ,
            'method'           => ['required', 'in:cash,gcash,bank_transfer'] ,
            'reference_number' => ['nullable', 'string'] ,
            'notes'            => ['nullable', 'string'] ,
        ];
    }
}
