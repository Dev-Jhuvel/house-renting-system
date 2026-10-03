<?php

namespace App\Services;

use App\Models\Bill;
use App\Repositories\BillRepository;
use Illuminate\Support\Facades\DB;

class BillService
{

    public function __construct(
        private BillRepository $billRepository
    )
    {}
    public function create(array $data) :Bill
    {
        return $this->billRepository->createBill($data);
    }

    public function delete(Bill $bill) :void
    {
        $this->billRepository->deleteBill($bill);
    }

    public function syncBillStatus(Bill $bill): void
    {
        $total_paid = $bill->total_paid;

        $bill_status = match (true) {
            $total_paid >= $bill->amount    => 'paid',
            $total_paid > 0                 => 'partial',
            default                         => 'unpaid',
        };

        $this->billRepository->updateBill($bill, ['status' => $bill_status]);
    }
}
