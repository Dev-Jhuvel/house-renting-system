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
        $tenants = Tenant::with(['user', 'booking.room.house'])->orderBy('name')->get();
        return Inertia::render('Tenants/TenantIndex', ['tenants' => $tenants]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'                  => 'required|string',
            'email'                 => 'required|email|unique:users,email',
            'password'              => 'required|confirmed',
            'phone'                 => 'required|string|unique:rooms,phone',
            'address'               => 'required|string',
            'emergency_contact'     => 'required|string',
            'id_type'               => 'required|string',
            'id_number'             => 'required|numeric|unique:rooms,id_number',
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
        $validated = $request->validate([
            'name'                  => 'required|string',
            'email'                 => 'required|email|unique:users,email,'.$tenant->email,
            // 'password'              => 'required|confirmed',
            'phone'                 => 'required|string|unique:rooms,phone,'.$tenant->phone,
            'address'               => 'required|string',
            'emergency_contact'     => 'required|string',
            'id_type'               => 'required|string',
            'id_number'             => 'required|numeric|unique:rooms,id_number,'.$tenant->id_number,
            'status'                => 'required|in:active,inactive'
        ]);

        DB::transaction(function () use ($validated, $tenant) {
            $tenant->user->update([
                'name'     => $validated['name'],
                'email'    => $validated['email'],
                'password' => bcrypt($validated['password']),
                'role'     => 'tenant',
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

        return redirect()->route('tenants.show', $tenant)->with('success', 'Tenant updated successfully!');
    }

    public function destroy(Tenant $tenant)
    {
        $tenant->delete();
        return redirect()->route('tenants.index')->with('success', 'Tenant deleted successfully!');
    }
}
