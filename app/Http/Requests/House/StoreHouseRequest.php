<?php

namespace App\Http\Requests\House;

use Illuminate\Foundation\Http\FormRequest;

class StoreHouseRequest extends FormRequest
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
            'name'          => ['required', 'string'],
            'address'       => ['required', 'string'],
            'description'   => ['required', 'string'],
            'city'          => ['required', 'string'],
            'max_floor'     => ['required', 'numeric'],
            'max_room'      => ['required', 'numeric'],
            'water_rate'    => ['required', 'numeric'],
            'electric_rate' => ['required', 'numeric'],
            'status'        => ['required', 'in:active,inactive']
        ];
    }
}
