<?php
 
namespace Database\Factories;
 
use App\Models\House;
use Illuminate\Database\Eloquent\Factories\Factory;
 
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Room>
 */
class RoomFactory extends Factory
{
    public function definition(): array
    {
        return [
            'house_id'      => House::factory(),
            'room_number'   => fake()->unique()->bothify('Room-##'),
            'floor'         => 1,
            'type'          => 'single',
            'monthly_rent'  => 3500,
            'capacity'      => 1,
            'status'        => 'available',
            'description'   => fake()->sentence(),
        ];
    }
}
 