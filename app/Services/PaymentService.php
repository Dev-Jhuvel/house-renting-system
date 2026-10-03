<?php

namespace App\Services;

use App\Models\Bill;
use App\Models\Payment;
use App\Repositories\DbRepository;
use App\Repositories\PaymentRepository;

class PaymentService
{
    public function __construct(
        private BillService $billService,
        private PaymentRepository $paymentRepository,
        private DbRepository $dbRepository
    )
    {}
    public function record(array $data, Bill $bill): void
    {
        try {
            $this->dbRepository->beginTrans();

            $payment = $this->paymentRepository->createPayment($data, 'confirmed');

            $this->paymentRepository->attachBill($payment, $bill, $data['amount_paid']);

            $this->billService->syncBillStatus($bill);

            $this->dbRepository->commit();
        } catch (\Throwable $th) {
            $this->dbRepository->rollback();

            throw $th;
        }
    }

    public function submit(array $data, Bill $bill): void
    {
        try {
            $this->dbRepository->beginTrans();

            $payment = $this->paymentRepository->createPayment($data, 'pending');
                
            $this->paymentRepository->attachBill($payment, $bill, $data['amount_paid']);

            $this->dbRepository->commit();
        } catch (\Throwable $th) {
            $this->dbRepository->rollback();

            throw $th;
        }
    }

    public function approve(Payment $payment): void
    {
        try {
            $this->dbRepository->beginTrans();
            
            $this->paymentRepository->updatePaymentStatus($payment, 'confirmed');

            $this->billService->syncBillStatus($payment->bill);

            $this->dbRepository->commit();
        } catch (\Throwable $th) {
            $this->dbRepository->rollback();

            throw $th;
        }
    }

    public function reject(Payment $payment, ?string $reason): void
    {
        try {
            $this->dbRepository->beginTrans();
            
            $this->paymentRepository->updatePaymentStatus($payment, 'rejected', $reason);

            $this->dbRepository->commit();
        } catch (\Throwable $th) {
            $this->dbRepository->rollback();

            throw $th;
        }
    }

    public function delete(Payment $payment, Bill $bill) :void
    {

        try {
            $this->dbRepository->beginTrans();
            
            $this->paymentRepository->deletePayment($payment);

            $this->billService->syncBillStatus($bill);

            $this->dbRepository->commit();
        } catch (\Throwable $th) {
            $this->dbRepository->rollback();

            throw $th;
        }
    }

}
