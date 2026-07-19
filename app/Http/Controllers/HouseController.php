<?php

namespace App\Http\Controllers;

use App\Http\Requests\House\StoreHouseRequest;
use App\Http\Requests\House\UpdateHouseRequest;
use App\Models\House;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HouseController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', House::class);

        $auth_id = Auth::id();
        $houses = House::ownedBy($auth_id)->withCount('rooms')->orderBy('name')->get();
        return Inertia::render('Houses/HouseIndex', ['houses' => $houses]);
    }

    public function store(StoreHouseRequest $request)
    {
        $this->authorize('create', House::class);

        $validated = $request->validated();

        $validated['user_id'] = Auth::user()->id;

        House::create($validated);

        return redirect()->route('houses.index')->with('success', 'House created successfully!');
    }

    public function show(House $house)
    {
        $this->authorize('view', $house);

        $house
            ->loadCount([
                'rooms',
                'rooms as occupied_count' => function($q){
                    return $q->whereIn('status', ['occupied', 'reserved']);
                }
            ])
            ->load('rooms.booking');
        
        return Inertia::render('Houses/HouseShow', ['house' => $house]);
    }

    public function update(UpdateHouseRequest $request, House $house)
    {
        $this->authorize('update', $house);

        $validated = $request->validated();

        $house->update($validated);

        return redirect()->route('houses.show', $house)->with('success', 'House updated successfully!');
    }

    public function destroy(House $house)
    {
        $house->delete();
        return redirect()->route('houses.index')->with('success', 'House deleted successfully!');
    }
}
