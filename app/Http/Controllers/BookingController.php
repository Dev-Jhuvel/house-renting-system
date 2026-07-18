<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBookingRequest;
use App\Models\Booking;
use App\Models\Room;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BookingController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Booking::class);

        $auth_id = Auth::id();
        $bookings = Booking::ownedBy($auth_id)->with(['tenant.user', 'room.house', 'deposits'])->withCount('unpaid_bills')->latest()->get();
        $tenants = Tenant::with('user', 'booking')->get()->map(function ($item) {
            return [
                'label'     => $item->user->name,
                'value'     => $item->id,
                'disabled'  => $item->booking !== null,
            ];
        })->sortBy('label')->values();

        $rooms = Room::ownedBy($auth_id)->orderBy('room_number')->get()->map(function ($item) {
            return [
                'label'     => $item->room_number,
                'value'     => $item->id,
                'disabled'  => in_array($item->status, ['occupied', 'maintenance', 'reserved']),
            ];
        })->sortBy('label')->values();
        $data = [
            'bookings' => $bookings,
            'tenants' => $tenants,
            'rooms' => $rooms,
        ];

        return Inertia::render('Bookings/BookingIndex', $data);
    }

    public function store(StoreBookingRequest $request)
    {
        $this->authorize('create', Booking::class);

        $validated = $request->validated();
        $validated['status'] = 'pending';

        DB::transaction(function () use ($validated) {
            $booking = Booking::create($validated);

            $this->updateRoom($booking);
        });

        return redirect()->route('bookings.index')->with('success', 'Booking created successfully!');
    }


    public function show(Booking $booking)
    {
        // $booking
        //     ->loadCount([
        //         'rooms',
        //         'rooms as occupied_count' => function ($q) {
        //             return $q->where('status', 'occupied');
        //         }
        //     ])
        //     ->load('rooms');

        // return Inertia::render('Bookings/BookingShow', ['booking' => $booking]);
    }

    public function update(Request $request, Booking $booking)
    {
        $this->authorize('update', $booking);

        $validated = $request->validate([
            'tenant_id'             => 'required|uuid',
            'room_id'               => 'required|uuid',
            'move_in_date'          => 'required|date',
            'move_out_date'         => 'nullable|date',
            // 'due_day'               => 'required|numeric',
            'notes'                 => 'string',
            'status'                => 'required|in:active,ended,pending,canceled'
        ]);

        $booking->update($validated);

        return redirect()->route('bookings.index', $booking)->with('success', 'Booking updated successfully!');
    }

    public function destroy(Booking $booking)
    {
        $this->authorize('delete', $booking);

        DB::transaction(function () use ($booking) {
            $this->updateRoom($booking);
            $booking->bills()->delete();
            $booking->delete();
        });
        return redirect()->route('bookings.index')->with('success', 'Booking deleted successfully!');
    }

    private function updateRoom(Booking $booking)
    {
        $room_status = match ($booking->status) {
            'active'            => 'occupied',
            'ended', 'canceled' => 'available',
            'pending'           => 'reserved',
        };
        $booking->room()->update(['status' => $room_status]);
    }

    public function updateStatus(Request $request, Booking $booking)
    {
        $validated = $request->validate([
            'status' => 'required|in:active,ended,pending,canceled'
        ]);

        DB::transaction(function () use ($booking, $validated) {
            $today = now()->toDateString();
            
            if($validated['status'] === 'ended'){
                $validated['move_out_date'] = $today;
            }

            $booking->update($validated);

            if($validated['status'] === 'active'){
                $booking->bills()->create([
                    'type' => 'rent',
                    'title' => $booking->tenant->user->name. " Rent Bill ".now()->format('F Y'),
                    'amount' => $booking->room->monthly_rent,
                    'bill_date' => $today,
                    'due_date'  => now()->day($booking->due_day)->toDateString(),
                    'status'    => 'unpaid',
                ]);
            }

            $this->updateRoom($booking);
        });
    }
}
