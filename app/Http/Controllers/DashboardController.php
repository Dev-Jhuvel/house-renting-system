<?php

namespace App\Http\Controllers;

use App\Models\Bill;
use App\Models\Payment;
use App\Models\Room;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(){

        # Tenants
        $active_tenants = Tenant::where('status', 'active')->count();
        $total_tenants = Tenant::count();
        $t_occupancy_rate = $total_tenants > 0 ? round(($active_tenants/ $total_tenants) * 100, 2) :  0;

        # Rooms
        $occupied_rooms = Room::where('status', 'occupied')->count();
        $total_rooms = Room::count();
        $r_occupancy_rate = $total_rooms > 0 ? round(($occupied_rooms/ $total_rooms) * 100, 2) :  0;

        # Revenue
        $total_unpaid_bills = Bill::where('status', 'unpaid')->sum('amount');
        $total_revenue = Payment::sum('amount_paid');

        $data = [
            'tenants' => [
                'active_tenants'    => $active_tenants,
                'total_tenants'     => $total_tenants,
                'occupancy_rate'    => $t_occupancy_rate,
            ],
            'rooms' => [
                'occupied_rooms'    => $occupied_rooms,
                'total_rooms'       => $total_rooms,
                'occupancy_rate'    => $r_occupancy_rate,
            ],
            'total_unpaid_bills' => number_format($total_unpaid_bills, 2),
            'total_revenue' => number_format($total_revenue, 2),
        ];

        return Inertia::render('Dashboard', ['data' => $data]);
    }
}
