<?php

namespace App\Services;

use App\Models\Bill;
use Illuminate\Support\Facades\DB;

class BillService
{
    public function create( array $data) :Bill
    {
        return Bill::create($data);
    }

    public function delete(Bill $bill) :void
    {
        if($bill->payments()->exists()) {
            return;
        }
        $bill->delete();
    }

    public function syncBillStatus(Bill $bill): void
    {
        $total_paid = $bill->total_paid;

        $bill_status = match (true) {
            $total_paid >= $bill->amount    => 'paid',
            $total_paid > 0                 => 'partial',
            default                         => 'unpaid',
        };
        $bill->update(['status' => $bill_status]);
    }
}
