<?php

namespace App\Http\Controllers;

use App\Models\Bill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BillController extends Controller
{
    public function index()
    {
        $bills = Bill::with(['booking.room.house', 'booking.tenant.user', 'bill_payment'])->latest()->get();
        return Inertia::render('Bills/BillIndex', ['bills' => $bills]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type'                  => 'required|in:rent,water,electric,other',
            'title'                 => 'required|string',
            'amount'                => 'required|string',
            'previous_reading'      => 'required|string',
            'current_reading'       => 'required|string',
            'rate_used'             => 'required|string',
            'bill_date'             => 'required|string',
            'due_date'              => 'required|string',
            'notes'                 => 'required|string',
            'status'                => 'required|in:active,inactive'
        ]);

        $validated['user_id'] = Auth::user()->id;

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
            'type'                  => 'required|in:rent,water,electric,other',
            'title'                 => 'required|string',
            'amount'                => 'required|string',
            'previous_reading'      => 'required|string',
            'current_reading'       => 'required|string',
            'rate_used'             => 'required|string',
            'bill_date'             => 'required|string',
            'due_date'              => 'required|string',
            'notes'                 => 'required|string',
            'status'                => 'required|in:active,inactive'
        ]);

        $bill->update($validated);

        return redirect()->route('bills.show', $bill)->with('success', 'Bill updated successfully!');
    }

    public function destroy(Bill $bill)
    {
        $bill->delete();
        return redirect()->route('bills.index')->with('success', 'Bill deleted successfully!');
    }
}
