<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class TenantDashboardController extends Controller
{
    public function index()
    {
       try {
            $tenant = auth()->user()->tenant()
                ->with([
                    'booking.room.house',
                    'booking.unpaid_bills',
                    'booking.bills.payments',
                    'booking.deposits'
                ])
                ->firstOrFail();

            $sorted_bills = $tenant->booking->bills->sortBy(function($bill){
                return $bill->status === 'paid';
            })->values();

            $tenant->booking->setRelation('bills', $sorted_bills);

            return Inertia::render('Dashboards/TenantDashboard', ['tenant' => $tenant]);
       } catch (\Throwable $th) {
            return redirect()->route('register.tenant.index');
       }
    }
}
