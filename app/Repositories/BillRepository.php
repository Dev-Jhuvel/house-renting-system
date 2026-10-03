<?php

namespace App\Repositories;

use App\Models\Bill;

class BillRepository{

    public function createBill(array $data){
        return Bill::create($data);
    }

    public function deleteBill(Bill $bill){
        if($bill->payments()->exists()) {
            return;
        }
        $bill->delete();
    }

    public function updateBill(Bill $bill, array $data){
        $bill->update($data);
    }
}

