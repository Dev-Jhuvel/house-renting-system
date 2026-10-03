<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class TenantBookingController extends Controller
{
    public function index(){
        $tenant = auth()->user()->tenant()
                ->with([
                    'booking.room.house.owner',
                    'booking.unpaid_bills',
                    'booking.bills.payments',
                    'booking.deposits'
                ])
                ->firstOrFail();

            $sorted_bills = $tenant->booking->bills->sortBy(function($bill){
                return $bill->status === 'paid';
            })->values();

            $tenant->booking->setRelation('bills', $sorted_bills);
        return Inertia::render("TenantPages/Bookings/Booking", ['tenant' => $tenant]);
    }
}
