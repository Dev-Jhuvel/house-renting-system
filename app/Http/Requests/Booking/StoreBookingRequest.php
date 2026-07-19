<?php

namespace App\Http\Requests\Booking;

use App\Models\Room;
use App\Models\Tenant;
use App\Rules\OwnedByAuthUser;
use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
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
            'tenant_id'     => ['required','uuid'],
            'room_id'       => ['required','uuid', new OwnedByAuthUser(Room::class)],
            'move_in_date'  => ['required','date'],
            'move_out_date' => ['nullable','date', 'after:move_in_date'],
            'notes'         => ['nullable','string'],
        ];
    }
}
