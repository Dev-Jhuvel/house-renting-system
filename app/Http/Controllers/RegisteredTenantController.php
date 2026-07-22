<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class RegisteredTenantController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        if ($user->tenant) {
            return redirect()->route('dashboard')->with('error', 'Your tenant profile already exists.');
        }

        return Inertia::render('Auth/RegisterTenant', ['user' => $user]);
    }
    public function store(Request $request)
    {
        $user = auth()->user();
        if ($user->tenant) {
            return redirect()->route('dashboard')->with('error', 'Your tenant profile already exists.');
        }

        $validated = $request->validate([
            'phone'             => 'required|string|unique:tenants,phone',
            'address'           => 'required|string',
            'emergency_contact' => 'required|string',
            'id_type'           => 'required|string',
            'id_number'         => 'required|string|unique:tenants,id_number',
        ]);

        $user->tenant()->create([
            'phone'             => $validated['phone'],
            'address'           => $validated['address'],
            'emergency_contact' => $validated['emergency_contact'],
            'id_type'           => $validated['id_type'],
            'id_number'         => $validated['id_number'],
        ]);

        return redirect()->route('dashboard')->with('success', 'Tenant created successfully!');
    }
}
