<?php

namespace App\Http\Controllers;

use App\Http\Requests\Booking\StoreBookingRequest;
use App\Http\Requests\Booking\UpdateBookingRequest;
use App\Models\Booking;
use App\Models\Room;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Services\BookingService;
use Inertia\Inertia;

class BookingController extends Controller
{
    public function __construct(
        private BookingService $bookingService
    )
    {}

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

        $this->bookingService->create($validated);

        return redirect()->route('bookings.index')->with('success', 'Booking created successfully!');
    }


    public function show(Booking $booking)
    {
        //    
    }

    public function update(UpdateBookingRequest $request, Booking $booking)
    {
        $this->authorize('update', $booking);

        $validated = $request->validated();

        $this->bookingService->update($booking, $validated);

        return redirect()->route('bookings.index', $booking)->with('success', 'Booking updated successfully!');
    }

    public function destroy(Booking $booking)
    {
        $this->authorize('delete', $booking);

        $this->bookingService->delete($booking);

        return redirect()->route('bookings.index')->with('success', 'Booking deleted successfully!');
    }

    public function updateBookingStatus(Request $request, Booking $booking)
    {
        $this->authorize('update', $booking);

        $status = $request->validate([
            'status' => 'required|in:active,ended,pending,canceled'
        ])['status'];

        match($status){
            'active'    => $this->bookingService->activate($booking),
            'ended'     => $this->bookingService->end($booking),
            'canceled'  => $this->bookingService->cancel($booking),
            'default'    => null,
        };

        return back()->with('success', 'Booking updated successfully.');

    }
}
