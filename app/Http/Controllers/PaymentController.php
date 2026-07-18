<?php

namespace App\Http\Controllers;

use App\Models\Bill;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    public function store(Request $request, Bill $bill)
    {
        $this->authorize('create', $bill);

        $validated = $request->validate([
            'amount_paid'      => 'required|numeric|min:0.01|max:'.$bill->remaining_balance,
            'paid_at'          => 'required|date',
            'method'           => 'required|in:cash,gcash,bank_transfer',
            'reference_number' => 'nullable|string',
            'notes'            => 'nullable|string',
        ]);

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
