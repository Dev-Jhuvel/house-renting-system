<?php

namespace App\Http\Controllers;

use App\Models\Bill;
use App\Models\Payment;
use App\Models\Room;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {

        $auth       = Auth::user();
        $auth_id    = $auth->id;

        if($auth->role === 'tenant'){
            return redirect(route('dashboard', absolute: false));
        }
        # Tenants
        $tenants_count = Tenant::ownedBy($auth_id)
        ->selectRaw("COUNT(*) AS total, SUM(status = 'active') AS active")
        ->first();

        $total_tenants      = (int) $tenants_count->total;
        $active_tenants     = (int) $tenants_count->active;
        $t_occupancy_rate   = $total_tenants > 0 ? round(($active_tenants / $total_tenants) * 100, 2) :  0;

        # Rooms
        $room_count = Room::ownedBy($auth_id)
        ->selectRaw("COUNT(*) AS total, SUM(status = 'occupied') AS occupied")
        ->first();

        $total_rooms        = (int) $room_count->total;
        $occupied_rooms     = (int) $room_count->occupied;
        $r_occupancy_rate   = $total_rooms > 0 ? round(($occupied_rooms / $total_rooms) * 100, 2) :  0;

        # Revenue
        $total_unpaid_bills = Bill::ownedBy($auth_id)
        ->where('status', 'unpaid')->sum('amount');

        $total_revenue = Payment::ownedBy($auth_id)
        ->sum('amount_paid');

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

        return Inertia::render('Dashboards/AdminDashboard', ['data' => $data]);
    }
}
