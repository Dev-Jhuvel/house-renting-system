<?php
 
namespace Database\Factories;
 
use App\Models\Booking;
use Illuminate\Database\Eloquent\Factories\Factory;
 
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Deposit>
 */
class DepositFactory extends Factory
{
    public function definition(): array
    {
        return [
            'booking_id' => Booking::factory(),
            'amount'     => 3500,
            'paid_at'    => now()->toDateString(),
            'notes'      => null,
            'type'       => 'received',
        ];
    }
}
 