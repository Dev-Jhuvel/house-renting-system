<?php

namespace App\Http\Controllers;

use App\Http\Requests\Bill\StoreBillRequest;
use App\Models\Bill;
use App\Models\Booking;
use App\Services\BillService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BillController extends Controller
{
    public function __construct(
        private BillService $billService
    )
    {}
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

    public function store(StoreBillRequest $request)
    {
        $this->authorize('create', Bill::class);

        $validated = $request->validated();

        $this->billService->create($validated);

        return redirect()->route('bills.index')->with('success', 'Bill created successfully!');
    }

    public function show(Bill $bill)
    {
        //
    }

    public function update(Request $request, Bill $bill)
    {
        //
    }

    public function destroy(Bill $bill)
    {
        $this->authorize('delete', $bill);

        $this->billService->delete($bill);
        return redirect()->route('bills.index')->with('success', 'Bill deleted successfully!');
    }
}
