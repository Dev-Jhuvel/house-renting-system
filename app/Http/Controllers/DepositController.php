<?php

namespace App\Http\Controllers;

use App\Http\Requests\Deposit\StoreDepositRequest;
use App\Models\Booking;
use App\Models\Deposit;
use App\Services\BookingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DepositController extends Controller
{

    public function __construct(
        private BookingService $bookingService
    )
    {}
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDepositRequest $request, Booking $booking)
    {
        $this->authorize('create', Deposit::class);

        $message = "Deposit Recorded";

       DB::transaction(function() use ($booking, &$message, $request){

            $validated = $request->validated();

            $booking->deposits()->create($validated);

            if($booking->status === 'pending' && $booking->total_deposit >= $booking->required_deposit){
                $this->authorize('update', $booking);

                $this->bookingService->activate($booking);
                $message = "Deposit Recorded and Booking is activated";
            }
       });

        return redirect()->back()->with('success', $message);
    }

    /**
     * Display the specified resource.
     */
    public function show(Deposit $deposit)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Deposit $deposit)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Deposit $deposit)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Deposit $deposit)
    {
        $this->authorize('delete', $deposit);

        $deposit->delete();

        return redirect()->back()->with('success', 'Deposit deleted.');
    }
}
