<?php

namespace App\Repositories;

use App\Models\Room;

class RoomRepository{

    // public function createBill(array $data){
    //     return Bill::create($data);
    // }

    // public function deleteBill(Bill $bill){
    //     if($bill->payments()->exists()) {
    //         return;
    //     }
    //     $bill->delete();
    // }

    public function updateRoom(Room $room, array $data){
        $room->update($data);
    }

}

