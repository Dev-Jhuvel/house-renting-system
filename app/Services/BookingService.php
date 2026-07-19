<?php

namespace App\Services;

use App\Models\Booking;
use Illuminate\Support\Facades\DB;

class BookingService
{
    public function create(array $data): Booking
    {
        return DB::transaction(function () use ($data) {

            $booking = Booking::create($data);

            $booking->refresh();

            $this->syncRoom($booking);
            $this->syncTenant($booking);

            return $booking;
        });
    }

    public function update(Booking $booking, array $data): Booking
    {
        return DB::transaction(function () use ($booking, $data) {

            $booking->update($data);

            return $booking->refresh();
        });
    }

    public  function activate(Booking $booking): void
    {
        DB::transaction(function () use ($booking) {
            if ($booking->status !== 'pending') {
                return;
            }

            $booking->update(['status' => 'active']);

            $this->syncRoom($booking);
            $this->syncTenant($booking);

            if ($booking->bills()->doesntExist()) {
                $today = now();

                $booking->bills()->create([
                    'type'      => 'rent',
                    'title'     => $booking->tenant->user->name . " Rent Bill " . now()->format('F Y'),
                    'amount'    => $booking->room->monthly_rent,
                    'bill_date' => $today->toDateString(),
                    'due_date'  => $today->copy()->addDays(10)->toDateString(),
                ]);
            }
        });
    }

    public  function end(Booking $booking): void
    {
        DB::transaction(function () use ($booking) {

            $booking->update([
                'status'        => 'ended',
                'move_out_date' =>  now()->toDateString()
            ]);

            $this->syncRoom($booking);
            $this->syncTenant($booking);
        });
    }

    public  function cancel(Booking $booking): void
    {
        DB::transaction(function () use ($booking) {

            $booking->update([
                'status'        => 'canceled',
            ]);

            $this->syncRoom($booking);
            $this->syncTenant($booking);
        });
    }

    public function delete(Booking $booking) :void
    {
        DB::transaction(function () use ($booking) {
            $this->cancel($booking);
            $this->syncRoom($booking);
            $this->syncTenant($booking);
            $booking->delete();
        });
    }

    private function syncRoom(Booking $booking)
    {
        $room_status = match ($booking->status) {
            'active'            => 'occupied',
            'ended', 'canceled' => 'available',
            'pending'           => 'reserved',
        };
        $booking->room()->update(['status' => $room_status]);
    }

    private function syncTenant(Booking $booking)
    {
        $tenant_status = match ($booking->status) {
            'active'            => 'active',
            'ended', 'canceled' => 'inactive',
            'pending'           => 'pending',
        };

        $booking->tenant()->update(['status' => $tenant_status]);
    }
}
