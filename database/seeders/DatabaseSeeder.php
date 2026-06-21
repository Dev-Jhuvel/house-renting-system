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
            'status'        => 'occupied',
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
            'move_out_date'  => '2025-02-01', // null = no fixed end date
            'deposit_amount' => 3500.00,
            'due_day'        => 5, // due every 5th of the month
            'status'         => 'active',
            'notes'          => 'First month free.',
        ]);

        // Electric Bill
        $electric_bill = Bill::create([
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
        $water_bill = Bill::create([
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
        $rent_bill = Bill::create([
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

        $electric_bill->payments()->create([
            'amount_paid'      => 250.00,
            'paid_at'          => '2025-01-03 10:00:00',
            'method'           => 'cash',
            'reference_number' => null,
            'proof_photo'      => null,
            'status'           => 'confirmed',
        ]);

        $electric_bill->update([
            'status' => 'paid'
        ]);

        // after your existing seeder code, add:

        // 10 additional available rooms
        $room_types = ['single', 'double', 'studio', 'dormitory'];

        foreach (range(102, 111) as $index => $room_number) {
            Room::create([
                'house_id'     => $house->id,
                'room_number'  => (string) $room_number,
                'floor'        => rand(1, 3),
                'type'         => $room_types[$index % count($room_types)],
                'monthly_rent' => rand(2, 5) * 500,
                'capacity'     => rand(1, 4),
                'status'       => 'available',
                'description'  => "Room $room_number - available for occupancy.",
            ]);
        }

        // 10 additional tenants with no booking
        $tenant_data = [
            ['name' => 'Maria Santos',    'email' => 'maria@email.com'],
            ['name' => 'Pedro Reyes',     'email' => 'pedro@email.com'],
            ['name' => 'Ana Cruz',        'email' => 'ana@email.com'],
            ['name' => 'Jose Dela Cruz',  'email' => 'jose@email.com'],
            ['name' => 'Rosa Mendoza',    'email' => 'rosa@email.com'],
            ['name' => 'Carlos Garcia',   'email' => 'carlos@email.com'],
            ['name' => 'Elena Villanueva', 'email' => 'elena@email.com'],
            ['name' => 'Ramon Torres',    'email' => 'ramon@email.com'],
            ['name' => 'Luisa Ramos',     'email' => 'luisa@email.com'],
            ['name' => 'Miguel Flores',   'email' => 'miguel@email.com'],
        ];

        foreach ($tenant_data as $data) {
            $user = User::factory()->create([
                'name'     => $data['name'],
                'email'    => $data['email'],
                'password' => 'secretpassword',
                'role'     => 'tenant',
            ]);

            Tenant::create([
                'user_id'           => $user->id,
                'phone'             => '09' . rand(100000000, 999999999),
                'address'           => 'Cavite',
                'emergency_contact' => 'Parent',
                'id_type'           => 'National ID',
                'id_number'         => 'NID-' . rand(10000, 99999),
                'status'            => 'active',
            ]);
        }
    }
}
