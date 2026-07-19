<?php

namespace App\Http\Requests\Room;

use App\Models\House;
use App\Rules\OwnedByAuthUser;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRoomRequest extends FormRequest
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
        $unique_room = Rule::unique('rooms')->where(fn ($query) => $query->where('house_id', $this->house_id));

        return [
            'room_number'   => ['required', 'string', $unique_room],
            'description'   => ['required', 'string'],
            'house_id'      => ['required', 'uuid', new OwnedByAuthUser(House::class)],
            'floor'         => ['required', 'numeric'],
            'type'          => ['required', 'in:single,double,studio,dormitory'],
            'monthly_rent'  => ['required', 'numeric'],
            'capacity'      => ['required', 'numeric'],
        ];
    }
}
