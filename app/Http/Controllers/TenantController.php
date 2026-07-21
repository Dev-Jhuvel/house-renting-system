<?php

namespace App\Http\Controllers;

use App\Http\Requests\Tenant\StoreTenantRequest;
use App\Http\Requests\Tenant\UpdateTenantRequest;
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

    public function store(StoreTenantRequest $request)
    {
        $this->authorize('create', Tenant::class);

        $validated = $request->validated();

        DB::transaction(function () use ($validated) {
            $user = User::create([
                'name'     => $validated['name'],
                'email'    => $validated['email'],
                'password' => bcrypt($validated['password']),
                'role'     => 'tenant',
            ]);
            $user->tenant()->create([
                'phone'             => $validated['phone'],
                'created_by'        => Auth::id(),
                'address'           => $validated['address'],
                'emergency_contact' => $validated['emergency_contact'],
                'id_type'           => $validated['id_type'],
                'id_number'         => $validated['id_number'],
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

    public function update(UpdateTenantRequest $request, Tenant $tenant)
    {
        $this->authorize('update', $tenant);

        $validated = $request->validated();

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
