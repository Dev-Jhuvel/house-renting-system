<?php
 
namespace Database\Factories;
 
use App\Models\Bill;
use Illuminate\Database\Eloquent\Factories\Factory;
 
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'bill_id'           => Bill::factory(),
            'amount_paid'       => 1000,
            'paid_at'           => now()->toDateString(),
            'method'            => 'cash',
            'reference_number'  => null,
            'status'            => 'confirmed',
        ];
    }
}
 