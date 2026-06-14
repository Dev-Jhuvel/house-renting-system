<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BookingController extends Controller
{
    public function index()
    {
        $bookings = Booking::with(['tenant.user', 'room.house', 'bills'])->latest()->get();
        return Inertia::render('Bookings/BookingIndex', ['bookings' => $bookings]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'phone'                 => 'required|string|unique:rooms,phone',
            'address'               => 'required|string',
            'emergency_contact'     => 'required|string',
            'id_type'               => 'required|string',
            'id_number'             => 'required|numeric|unique:rooms,id_number',
            'status'                => 'required|in:active,inactive'
        ]);

        $validated['user_id'] = Auth::user()->id;

        Booking::create($validated);

        return redirect()->route('bookings.index')->with('success', 'Booking created successfully!');
    }

    public function show(Booking $booking)
    {
        $booking
            ->loadCount([
                'rooms',
                'rooms as occupied_count' => function($q){
                    return $q->where('status', 'occupied');
                }
            ])
            ->load('rooms');
            
        return Inertia::render('Bookings/BookingShow', ['booking' => $booking]);
    }

    public function update(Request $request, Booking $booking)
    {
        $validated = $request->validate([
            'phone'                 => 'required|string|unique:bookings,phone,'.$booking->id,
            'address'               => 'required|string',
            'emergency_contact'     => 'required|string',
            'id_type'               => 'required|string',
            'id_number'             => 'required|numeric|unique:bookings,id_number,'.$booking->id,
            'status'                => 'required|in:active,inactive'
        ]);

        $booking->update($validated);

        return redirect()->route('bookings.show', $booking)->with('success', 'Booking updated successfully!');
    }

    public function destroy(Booking $booking)
    {
        $booking->delete();
        return redirect()->route('bookings.index')->with('success', 'Booking deleted successfully!');
    }
}
