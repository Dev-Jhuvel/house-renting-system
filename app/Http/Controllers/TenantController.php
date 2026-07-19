<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TenantController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Tenant::class);
        $auth_id = Auth::id();
        $tenants = Tenant::ownedBy($auth_id)->with(['user', 'booking.room.house', 'booking.bills.payments'])
        ->get()
        ->sortBy('user.name')
        ->values();
        return Inertia::render('Tenants/TenantIndex', ['tenants' => $tenants]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Tenant::class);

        $validated = $request->validate([
            'name'                  => 'required|string',
            'email'                 => 'required|email|unique:users,email',
            'password'              => 'required|confirmed',
            'phone'                 => 'required|string|unique:tenants,phone',
            'address'               => 'required|string',
            'emergency_contact'     => 'required|string',
            'id_type'               => 'required|string',
            'id_number'             => 'required|numeric|unique:tenants,id_number',
            'status'                => 'required|in:active,inactive'
        ]);

        DB::transaction(function () use ($validated) {
            $user = User::create([
                'name'     => $validated['name'],
                'email'    => $validated['email'],
                'password' => bcrypt($validated['password']),
                'role'     => 'tenant',
            ]);
            $user->tenant()->create([
                'phone'             => $validated['phone'],
                'tenant_user_id'    => Auth::user()->id,
                'address'           => $validated['address'],
                'emergency_contact' => $validated['emergency_contact'],
                'id_type'           => $validated['id_type'],
                'id_number'         => $validated['id_number'],
                'status'            => $validated['status'],
            ]);
        });

        return redirect()->route('tenants.index')->with('success', 'Tenant created successfully!');
    }

    public function show(Tenant $tenant)
    {
        $this->authorize('view', $tenant);

        $tenant
            ->loadCount([
                'rooms',
                'rooms as occupied_count' => function ($q) {
                    return $q->where('status', 'occupied');
                }
            ])
            ->load('rooms');

        return Inertia::render('Tenants/TenantShow', ['tenant' => $tenant]);
    }

    public function update(Request $request, Tenant $tenant)
    {
        $this->authorize('update', $tenant);

        $validated = $request->validate([
            'name'                  => 'required|string',
            'email'                 => 'required|email|unique:users,email,'.$tenant->id,
            // 'password'              => 'required|confirmed',
            'phone'                 => 'required|string|unique:tenants,phone,'.$tenant->phone,
            'address'               => 'required|string',
            'emergency_contact'     => 'required|string',
            'id_type'               => 'required|string',
            'id_number'             => 'required|numeric|unique:tenants,id_number,'.$tenant->id_number,
            'status'                => 'required|in:active,inactive'
        ]);

        DB::transaction(function () use ($validated, $tenant) {
            $tenant->user->update([
                'name'     => $validated['name'],
                'email'    => $validated['email'],
            ]);
            $tenant->update([
                'phone'             => $validated['phone'],
                'address'           => $validated['address'],
                'emergency_contact' => $validated['emergency_contact'],
                'id_type'           => $validated['id_type'],
                'id_number'         => $validated['id_number'],
                'status'            => $validated['status'],
            ]);
        });

        return redirect()->route('tenants.index', $tenant)->with('success', 'Tenant updated successfully!');
    }

    public function destroy(Tenant $tenant)
    {
        $this->authorize('delete', $tenant);

        $tenant->delete();
        return redirect()->route('tenants.index')->with('success', 'Tenant deleted successfully!');
    }
}
