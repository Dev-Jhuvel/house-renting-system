<?php

namespace App\Services;

use App\Models\Bill;
use App\Models\Payment;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PaymentService
{
    public function __construct(
        private BillService $billService
    )
    {}
    public function record(array $data, Bill $bill): void
    {
        DB::transaction(function () use ($data, $bill) {
            $bill->payments()->create([
                ...$data,
                'status'        => 'confirmed',
                'submitted_by'  => Auth::id()
            ]);

            $this->billService->syncBillStatus($bill);
        });
    }

    public function submit(array $data, Bill $bill): void
    {
        DB::transaction(function () use ($data, $bill) {
            $bill->payments()->create([
                ...$data,
                'status'        => 'pending',
                'submitted_by'  => Auth::id()
            ]);
        });
    }

    public function approve(Payment $payment): void
    {
        DB::transaction(function () use ($payment) {
            $payment->update([
                'status' => 'confirmed',
            ]);
            $this->billService->syncBillStatus($payment->bill);
        });    
    }

    public function reject(Payment $payment, ?string $reason): void
    {
        DB::transaction(function () use ($payment, $reason) {
            $payment->update([
                'status'           => 'rejected',
                'rejection_reason' => $reason,
            ]);
        });    
    }

    public function delete(Payment $payment, Bill $bill) :void
    {
        DB::transaction(function () use ($payment, $bill) {
            $payment->delete();

            $this->billService->syncBillStatus($bill);
        });
    }
    
}
