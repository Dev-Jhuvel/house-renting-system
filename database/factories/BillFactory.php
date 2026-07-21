<?php
 
namespace Database\Factories;
 
use App\Models\Booking;
use Illuminate\Database\Eloquent\Factories\Factory;
 
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Bill>
 */
class BillFactory extends Factory
{
    public function definition(): array
    {
        return [
            'booking_id' => Booking::factory(),
            'type'       => 'rent',
            'title'      => 'Rent Bill',
            'amount'     => 3500,
            'bill_date'  => now()->toDateString(),
            'due_date'   => now()->addDays(10)->toDateString(),
            'status'     => 'unpaid',
            'notes'      => null,
        ];
    }
}
 