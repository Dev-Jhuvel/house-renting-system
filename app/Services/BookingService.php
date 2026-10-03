<?php

namespace App\Services;

use App\Models\Booking;
use App\Repositories\BillRepository;
use App\Repositories\BookingRepository;
use App\Repositories\DbRepository;
use App\Repositories\RoomRepository;
use App\Repositories\TenantRepository;
use Illuminate\Support\Facades\DB;

class BookingService
{

    public function __construct(
       private BookingRepository $bookingRepository,
       private BillRepository $billRepository,
       private RoomRepository $roomRepository,
       private TenantRepository $tenantRepository,
       private DbRepository $dbRepository,
    )
    {}
    public function create(array $data): Booking
    {
        try {
            $this->dbRepository->beginTrans();

            $booking = $this->bookingRepository->createBooking($data);

            $booking->refresh();
            $this->syncRoom($booking);
            $this->syncTenant($booking);

            $this->dbRepository->commit();

            return $booking;
        } catch (\Throwable $th) {
            $this->dbRepository->rollback();

            throw $th;
        }
    }

    public function update(Booking $booking, array $data): Booking
    {
        try {
            $this->dbRepository->beginTrans();
            
            $this->bookingRepository->updateBooking($booking, $data);
           
            $this->dbRepository->commit();

            return $booking->refresh();
        } catch (\Throwable $th) {
            $this->dbRepository->rollback();

            throw $th;
        }
    }

    public  function activate(Booking $booking): void
    {
        try {

            if ($booking->status !== 'pending') {
                return;
            }
            $this->dbRepository->beginTrans();
            
            $this->bookingRepository->updateBooking($booking, ['status' => 'active']);

            $this->syncRoom($booking);
            $this->syncTenant($booking);

            if ($booking->bills()->doesntExist()) {
                $today = now();

                $this->billRepository->createBill([
                    'booking_id'=> $booking->id,
                    'type'      => 'rent',
                    'title'     => $booking->tenant->user->name . " Rent Bill " . now()->format('F Y'),
                    'amount'    => $booking->room->monthly_rent,
                    'bill_date' => $today->toDateString(),
                    'due_date'  => $today->copy()->addDays(10)->toDateString(),
                ]);
            }
           
            $this->dbRepository->commit();
        } catch (\Throwable $th) {
            $this->dbRepository->rollback();

            throw $th;
        }
    }

    public  function end(Booking $booking): void
    {
        try {
            $this->dbRepository->beginTrans();
            
            $this->bookingRepository->updateBooking($booking, [
                'status'        => 'ended',
                'move_out_date' =>  now()->toDateString()
            ]);

            $this->syncRoom($booking);
            $this->syncTenant($booking);
           
            $this->dbRepository->commit();

        } catch (\Throwable $th) {
            $this->dbRepository->rollback();

            throw $th;
        }
    }

    public  function cancel(Booking $booking): void
    {
        try {
            $this->dbRepository->beginTrans();
            
            $this->bookingRepository->updateBooking($booking, [
                'status'        => 'canceled',
            ]);

            $this->syncRoom($booking);
            $this->syncTenant($booking);
           
            $this->dbRepository->commit();

        } catch (\Throwable $th) {
            $this->dbRepository->rollback();

            throw $th;
        }
    }

    public function delete(Booking $booking) :void
    {
        try {
            $this->dbRepository->beginTrans();
            
            $this->cancel($booking);
            $this->bookingRepository->deleteBooking($booking);
           
            $this->dbRepository->commit();

        } catch (\Throwable $th) {
            $this->dbRepository->rollback();

            throw $th;
        }
    }

    private function syncRoom(Booking $booking)
    {
        $room_status = match ($booking->status) {
            'active'            => 'occupied',
            'ended', 'canceled' => 'available',
            'pending'           => 'reserved',
        };
        $this->roomRepository->updateRoom($booking->room, ['status' => $room_status]);
    }

    private function syncTenant(Booking $booking)
    {
        $tenant_status = match ($booking->status) {
            'active'            => 'active',
            'ended', 'canceled' => 'inactive',
            'pending'           => 'pending',
        };

        $this->tenantRepository->updateTenant($booking->tenant, ['status' => $tenant_status]);
    }
}
