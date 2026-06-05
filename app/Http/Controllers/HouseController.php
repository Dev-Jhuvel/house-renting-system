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
        return Inertia::render('Houses/HouseIndex', ['houses' => $houses]);
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

        return redirect()->route('houses.index')->with('success', 'House created successfully!');
    }

    public function show(House $house)
    {
        return Inertia::render('Houses/HouseShow', ['house' => $house]);
    }

    public function update(Request $request, House $house)
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

        $house->update($validated);

        return redirect()->route('houses.show', $house)->with('success', 'House updated successfully!');
    }

    public function destroy(House $house){
        $house->delete();
        return redirect()->route('houses.index')->with('success', 'House deleted successfully!');

    }
}
