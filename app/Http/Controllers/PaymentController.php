<?php

namespace App\Http\Controllers;

use App\Http\Requests\Payment\StorePaymentRequest;
use App\Models\Bill;
use App\Models\Payment;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    public function __construct(
        private PaymentService $paymentService
    )
    {}
    public function store(StorePaymentRequest $request, Bill $bill)
    {
        $this->authorize('create', Payment::class);

        $validated = $request->validated();

       $this->paymentService->create($validated, $bill);

        return redirect()->back()->with('success', 'Payment Recorded');
    }

    public function destroy(Bill $bill, Payment $payment)
    {
        $this->authorize('delete', $payment);

        $this->paymentService->delete($payment, $bill);
        return redirect()->back()->with('success', 'Payment deleted.');
    }

}
