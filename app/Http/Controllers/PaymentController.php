<?php

namespace App\Http\Controllers;

use App\Http\Requests\Payment\StorePaymentRequest;
use App\Models\Bill;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    public function store(StorePaymentRequest $request, Bill $bill)
    {
        $this->authorize('create', $bill);

        $validated = $request->validated();

        DB::transaction(function () use ($validated, $bill) {
            $bill->payments()->create($validated);

            $this->updateBillStatus($bill);
        });

        return redirect()->back()->with('success', 'Payment Recorded');
    }

    public function destroy(Bill $bill, Payment $payment)
    {
        $this->authorize('delete', $payment);

        DB::transaction(function () use ($payment, $bill) {
            $payment->delete();

            $this->updateBillStatus($bill);
        });
        return redirect()->back()->with('success', 'Payment deleted.');
    }

    private function updateBillStatus(Bill $bill)
    {
        $total_paid = $bill->payments()->sum('amount_paid');

        $bill_status = match (true) {
            $total_paid >= $bill->amount    => 'paid',
            $total_paid > 0                 => 'partial',
            default                         => 'unpaid',
        };
        $bill->update(['status' => $bill_status]);
    }
}
