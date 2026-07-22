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
                    'booking.deposits'
                ])
                ->firstOrFail();

            return Inertia::render('Dashboards/TenantDashboard', ['tenant' => $tenant]);
       } catch (\Throwable $th) {
            return redirect()->route('register.tenant.index');
       }
    }
}
