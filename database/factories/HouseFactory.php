<?php
 
namespace Database\Factories;
 
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
 
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\House>
 */
class HouseFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id'       => User::factory()->state(['role' => 'landlord']),
            'name'          => fake()->company() . ' House',
            'address'       => fake()->address(),
            'description'   => fake()->sentence(),
            'city'          => fake()->city(),
            'max_floor'     => 2,
            'max_room'      => 10,
            'water_rate'    => 15.50,
            'electric_rate' => 12.75,
            'status'        => 'active',
        ];
    }
}
 