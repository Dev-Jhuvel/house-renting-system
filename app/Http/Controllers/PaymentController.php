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

       $this->paymentService->record($validated, $bill);

        return redirect()->back()->with('success', 'Payment recorded');
    }
    
    public function approve(Payment $payment){
        $this->authorize('update', $payment);

        $this->paymentService->approve($payment);
        return redirect()->back()->with('success', "Payment approved.");
    }

    public function reject(Request $request, Payment $payment){
        $this->authorize('update', $payment);
        $request->validate(['reason' => 'nullable|string']);
        $this->paymentService->reject($payment,  $request->reason);
        return redirect()->back()->with('success', "Payment rejected.");
    }

    public function destroy(Bill $bill, Payment $payment)
    {
        $this->authorize('delete', $payment);

        $this->paymentService->delete($payment, $bill);
        return redirect()->back()->with('success', 'Payment deleted.');
    }

}
