<?php

namespace App\Http\Controllers;

use App\Models\Bill;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BillController extends Controller
{
    public function index()
    {
        $auth_id = Auth::id();
        $bills = Bill::ownedBy($auth_id)->with(['booking.room.house', 'booking.tenant.user', 'payments'])->latest()->get();
        $bookings = Booking::ownedBy($auth_id)->with('tenant.user')->where('status', 'active')->get()->map(function ($item) {
            return [
                'label'     => $item->tenant->user->name.' - '.$item->created_at->format('F Y'),
                'value'     => $item->id,
            ];
        })->sortBy('label')->values();

        $data = [
            'bills'     => $bills,
            'bookings'  => $bookings
        ];
        return Inertia::render('Bills/BillIndex', $data);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type'                  => 'required|in:rent,water,electric,repair,other',
            'title'                 => 'required|string',
            'booking_id'            => 'required|uuid',
            'amount'                => 'required|numeric',
            'previous_reading'      => 'required|numeric',
            'current_reading'       => 'required|numeric|gt:previous_reading',
            'rate_used'             => 'required|numeric',
            'bill_date'             => 'required|date',
            'due_date'              => 'required|date',
            // 'notes'                 => 'string',
            // 'status'                => 'required|in:paid,unpaid,partial,overdue'
        ]);

        Bill::create($validated);

        return redirect()->route('bills.index')->with('success', 'Bill created successfully!');
    }

    public function show(Bill $bill)
    {
        $bill
            ->loadCount([
                'rooms',
                'rooms as occupied_count' => function ($q) {
                    return $q->where('status', 'occupied');
                }
            ])
            ->load('rooms');

        return Inertia::render('Bills/BillShow', ['bill' => $bill]);
    }

    public function update(Request $request, Bill $bill)
    {
        $validated = $request->validate([
            'type'                  => 'required|in:rent,water,electric,repair,other',
            'title'                 => 'required|string',
            'amount'                => 'required|numeric',
            'previous_reading'      => 'required|numeric',
            'current_reading'       => 'required|numeric',
            'rate_used'             => 'required|numeric',
            'bill_date'             => 'required|date',
            'due_date'              => 'required|date',
            // 'notes'                 => 'required|string',
            // 'status'                => 'required|in:paid,unpaid,partial,overdue'
        ]);

        $bill->update($validated);

        return redirect()->route('bills.index', $bill)->with('success', 'Bill updated successfully!');
    }

    public function destroy(Bill $bill)
    {
        $bill->delete();
        return redirect()->route('bills.index')->with('success', 'Bill deleted successfully!');
    }
}
