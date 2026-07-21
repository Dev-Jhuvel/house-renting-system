<?php
 
namespace Database\Factories;
 
use App\Models\Room;
use App\Models\Tenant;
use Illuminate\Database\Eloquent\Factories\Factory;
 
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Booking>
 */
class BookingFactory extends Factory
{
    public function definition(): array
    {
        return [
            'tenant_id'     => Tenant::factory(),
            'room_id'       => Room::factory(),
            'move_in_date'  => now()->toDateString(),
            'move_out_date' => null,
            'status'        => 'pending',
            'notes'         => fake()->sentence(),
        ];
    }
}