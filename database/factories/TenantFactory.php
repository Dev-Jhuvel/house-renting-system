<?php
 
namespace Database\Factories;
 
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
 
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Tenant>
 */
class TenantFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id'           => User::factory()->state(['role' => 'tenant']),
            'created_by'        => User::factory()->state(['role' => 'landlord']),
            'phone'             => fake()->unique()->phoneNumber(),
            'address'           => fake()->address(),
            'emergency_contact' => fake()->name() . ' - ' . fake()->phoneNumber(),
            'id_type'           => 'National ID',
            'id_number'         => fake()->unique()->numerify('##########'),
            'status'            => 'pending',
        ];
    }
}
 