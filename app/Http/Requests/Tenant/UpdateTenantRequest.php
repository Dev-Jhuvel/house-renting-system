<?php

namespace App\Http\Requests\Tenant;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTenantRequest extends FormRequest
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
        $tenant = $this->route('tenant');
        $unique_email       = Rule::unique('users', 'email')->ignore($tenant->user);        
        $unique_phone       = Rule::unique('tenants', 'phone')->ignore($tenant);
        $unique_id_number   = Rule::unique('tenants', 'id_number')->ignore($tenant);

        return [
            'name'              => ['required', 'string'],
            'email'             => ['required', 'email', $unique_email],
            'phone'             => ['required', 'string', $unique_phone],
            'address'           => ['required', 'string'],
            'emergency_contact' => ['required', 'string'],
            'id_type'           => ['required', 'string'],
            'id_number'         => ['required', 'string', $unique_id_number],
        ];
    }
}
