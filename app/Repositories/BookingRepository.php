<?php

namespace App\Repositories;

use App\Models\Booking;

class BookingRepository{
    public function createBooking(array $data){
        return Booking::create($data);
    }

    public function updateBooking(Booking $booking, array $data){
        return $booking->update($data);
    }

    public function deleteBooking(Booking $booking){
        if(!$booking->exists()){
            return;
        }
        $booking->delete();
    }
}