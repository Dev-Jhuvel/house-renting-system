<?php

namespace App\Repositories;

use App\Models\Bill;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class PaymentRepository{

    public function createPayment(array $data, string $status){
        $payment = Payment::create([
            ...$data,
            'status'        => $status,
            'submitted_by'  => auth()->id()
        ]);

        return $payment;
    }

    public function updatePaymentStatus(Payment $payment, string $status, string|null $rejection_reason = null){
        $payment->update([
            'status'            => $status,
            'rejection_reason'  => $rejection_reason
        ]);
    }

    public function attachBill(Payment $payment, Bill $bill, $amount){
        $bill->payments()->attach($payment->id, [
            'amount' => $amount
        ]);
    }

    public function deletePayment(Payment $payment){
        if(!$payment->exists()) {
            return;
        }
        $payment->delete();

    }

}

