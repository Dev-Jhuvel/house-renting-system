<?php

namespace App\Http\Controllers;

use App\Models\House;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HouseController extends Controller
{
    public function index()
    {
        $houses = House::with('owner')->latest()->get();
        return Inertia::render('HousePage', ['houses' => $houses]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'          => 'required|string',
            'address'       => 'required|string',
            'description'   => 'required|string',
            'city'          => 'required|string',
            'max_floor'      => 'required|numeric',
            'water_rate'     => 'required|numeric',
            'electric_rate'  => 'required|numeric'
        ]);

        $validated['user_id'] = Auth::user()->id;

        House::create($validated);

        return redirect()->route('houses.index')->with('success', 'House created sucessfully!');
    }
}
