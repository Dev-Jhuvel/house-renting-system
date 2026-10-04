<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Services\PaymentService;
use Inertia\Inertia;

class TenantBillPaymentController extends Controller
{
    public function __construct(
        private PaymentService $paymentService
    )
    {}
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
        return Inertia::render("TenantPages/Bills/BillPayment", ['tenant' => $tenant]);
    }

    public function payAll(Booking $booking){
        $unpaid_bills = $booking->unpaid_bills()->get();

        if(empty($unpaid_bills->count())){
            return redirect()->back()->with('error', 'No Unpaid Bills.');
        }

        $this->paymentService->submit(
            [
                'paid_at' => now()->toDateString(),
                'method' => 'cash',
            ],
            $unpaid_bills
        );

        return redirect()->back()->with('success', 'Payment for All bills is submitted.');
    }
}
