<?php

namespace App\Services;

use App\Models\Bill;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class PaymentService
{
    public function __construct(
        private BillService $billService
    )
    {}
    public function create(array $data, Bill $bill): void
    {
        DB::transaction(function () use ($data, $bill) {
            $bill->payments()->create($data);

            $this->billService->syncBillStatus($bill);
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
