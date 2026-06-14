<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RoomController extends Controller
{
    // public function index()
    // {
    //     $Rooms = Room::with('owner')->latest()->get();
    //     return Inertia::render('Rooms/RoomIndex', ['Rooms' => $rooms]);
    // }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_number'   => 'required|string|unique:rooms,room_number',
            'description'   => 'required|string',
            'house_id'      => 'required|uuid',
            'floor'         => 'required|numeric',
            'type'          => 'required|in:single,double,studio,dormitory',
            'monthly_rent'  => 'required|numeric',
            'capacity'      => 'required|numeric',
            'status'        => 'required|in:available,occupied,maintenance'
        ]);

        $validated['user_id'] = Auth::user()->id;

        Room::create($validated);
    
        return redirect()->route('houses.show', $request->house_id)->with('success', 'Room created successfully!');
    }

    public function show(Room $room)
    {
        return Inertia::render('Rooms/RoomShow', ['room' => $room]);
    }

    public function update(Request $request, Room $room)
    {
        $validated = $request->validate([
            'room_number'   => 'required|string|unique:rooms,room_number,'.$room->id,
            'description'   => 'required|string',
            'house_id'      => 'required|uuid',
            'floor'         => 'required|numeric',
            'type'          => 'required|in:single,double,studio,dormitory',
            'monthly_rent'  => 'required|numeric',
            'capacity'      => 'required|numeric',
            'status'        => 'required|in:available,occupied,maintenance'
        ]);

        $room->update($validated);

        return redirect()->route('rooms.show', $room)->with('success', 'Room updated successfully!');
    }

    public function destroy(Room $room)
    {
        $house_id = $room->house_id;
        $room->delete();
        return redirect()->route('houses.show', $house_id)->with('success', 'Room deleted successfully!');
    }
}
