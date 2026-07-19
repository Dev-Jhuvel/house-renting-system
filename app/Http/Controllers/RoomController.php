<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RoomController extends Controller
{
    // public function index()
    // {
    //     $Rooms = Room::with('user')->latest()->get();
    //     return Inertia::render('Rooms/RoomIndex', ['Rooms' => $rooms]);
    // }

    public function store(Request $request)
    {
        $this->authorize('create', Room::class);
        $validated = $request->validate([
            'room_number'   => 'required|string|unique:rooms,room_number',
            'description'   => 'required|string',
            'house_id'      => 'required|uuid',
            'floor'         => 'required|numeric',
            'type'          => 'required|in:single,double,studio,dormitory',
            'monthly_rent'  => 'required|numeric',
            'capacity'      => 'required|numeric',
        ]);

        $validated['user_id']   = Auth::user()->id;

        Room::create($validated);
    
        return redirect()->route('houses.show', $request->house_id)->with('success', 'Room created successfully!');
    }

    public function show(Room $room)
    {
        $this->authorize('view', $room);

        return Inertia::render('Rooms/RoomShow', ['room' => $room->load('booking')]);
    }

    public function update(Request $request, Room $room)
    {
        $this->authorize('update', $room);

        $validated = $request->validate([
            'room_number'   => 'required|string|unique:rooms,room_number,'.$room->id,
            'description'   => 'required|string',
            'house_id'      => 'required|uuid',
            'floor'         => 'required|numeric',
            'type'          => 'required|in:single,double,studio,dormitory',
            'monthly_rent'  => 'required|numeric',
            'capacity'      => 'required|numeric',
            'status'        => 'required|in:available,occupied,reserved,maintenance'
        ]);

        $room->update($validated);

        return redirect()->route('rooms.show', $room)->with('success', 'Room updated successfully!');
    }

    public function destroy(Room $room)
    {
        $this->authorize('delete', $room);

        $house_id = $room->house_id;
        $room->delete();
        return redirect()->route('houses.show', $house_id)->with('success', 'Room deleted successfully!');
    }
    public function updateRoomStatus(Request $request, Room $room)
    {
        $validated = $request->validate([
            'status' => 'required|in:available,occupied,reserved,maintenance'
        ]);

       $room->update($validated);
    }
}
