<?php

namespace Database\Seeders;

use App\Models\Bill;
use App\Models\Booking;
use App\Models\House;
use App\Models\Room;
use App\Models\Tenant;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $landlord = User::factory()->create([
            // 'id' => Str::uuid(),
            'name'      => 'Admin',
            'email'     => 'admin@email.com',
            'password'  => 'secretpassword',
            'role'      => 'admin',
        ]);

        $tenant = User::factory()->create([
            // 'id' => Str::uuid(),
            'name'      => 'Jhuvel Colina',
            'email'     => 'jhuvel@email.com',
            'password'  => 'secretpassword',
            'role'      => 'tenant',
        ]);

        // House
        $house = House::create([
            'user_id'       => $landlord->id,
            'name'          => 'Sunshine Boarding House',
            'address'       => '123 Rizal Street',
            'description'   => 'A clean and affordable boarding house in Cavite.',
            'city'          => 'Cavite City',
            'max_floor'     => 3,
            'max_room'      => 10,
            'water_rate'    => 150.00,
            'electric_rate' => 12.50,
            'status'        => 'active',
        ]);

        // Room
        $room = Room::create([
            'house_id'      => $house->id,
            'room_number'   => '101',
            'floor'         => 1,
            'type'          => 'single',
            'monthly_rent'  => 3500.00,
            'capacity'      => 1,
            'status'        => 'available',
            'description'   => 'Single room with a window and shared bathroom.',
        ]);

        $tenant = Tenant::create([
            'user_id'           => $tenant->id,
            'phone'             => "09123456789",
            'address'           => "Cavite",
            'emergency_contact' => "Mother",
            'id_type'           => "Driver License",
            'id_number'         => "D17126G61",
            'status'            => "active",
        ]);

        $booking = Booking::create([
            'tenant_id'      => $tenant->id,
            'room_id'        => $room->id,
            'move_in_date'   => '2025-01-01',
            'move_out_date'  => null, // null = no fixed end date
            'deposit_amount' => 3500.00,
            'due_day'        => 5, // due every 5th of the month
            'status'         => 'active',
            'notes'          => 'First month free.',
        ]);

        // Electric Bill
        $bill = Bill::create([
            'booking_id'       => $booking->id,
            'type'             => 'electric',
            'title'            => 'Electric Bill - January 2025',
            'amount'           => 250.00,
            'previous_reading' => 1200,
            'current_reading'  => 1220,
            'rate_used'        => 12.50, // falls back to house electric_rate
            'bill_date'        => '2025-01-01',
            'due_date'         => '2025-01-05',
            'status'           => 'unpaid',
            'notes'            => '20 kWh consumed.',
        ]);

        // Water Bill
        $waterBill = Bill::create([
            'booking_id'       => $booking->id,
            'type'             => 'water',
            'title'            => 'Water Bill - January 2025',
            'amount'           => 150.00,
            'previous_reading' => 300,
            'current_reading'  => 310,
            'rate_used'        => 150.00, // falls back to house water_rate
            'bill_date'        => '2025-01-01',
            'due_date'         => '2025-01-05',
            'status'           => 'unpaid',
            'notes'            => '10 cubic meters consumed.',
        ]);

        // Monthly Rent Bill
        $rentBill = Bill::create([
            'booking_id'       => $booking->id,
            'type'             => 'rent',
            'title'            => 'Monthly Rent - January 2025',
            'amount'           => 3500.00,
            'previous_reading' => null,
            'current_reading'  => null,
            'rate_used'        => null,
            'bill_date'        => '2025-01-01',
            'due_date'         => '2025-01-05',
            'status'           => 'unpaid',
            'notes'            => null,
        ]);
    }
}
