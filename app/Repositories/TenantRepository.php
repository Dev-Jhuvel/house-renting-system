<?php

namespace App\Repositories;

use App\Models\Tenant;

class TenantRepository {

    // public function createBill(array $data){
    //     return Bill::create($data);
    // }

    // public function deleteBill(Bill $bill){
    //     if($bill->payments()->exists()) {
    //         return;
    //     }
    //     $bill->delete();
    // }

    public function updateTenant(Tenant $tenant, array $data){
        $tenant->update($data);
    }

}

