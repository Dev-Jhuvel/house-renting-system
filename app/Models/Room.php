<?php

namespace App\Models;

use App\Models\Traits\HasActivityLog;
use App\Models\Traits\HasUuidAndSoftDeletes;
use App\Models\Traits\OwnedByUser;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasUuidAndSoftDeletes, HasActivityLog, OwnedByUser;
    protected $fillable = [
        'house_id',
        'room_number',
        'floor',
        'type',
        'monthly_rent',
        'capacity',
        'status',
        'description'
    ];

    protected function casts() :array
    {
        return [
            'floor'         => 'integer',
            'capacity'      => 'integer',
            'monthly_rent'  => 'decimal:2'
        ];
    }

    public function bookings(){
        return $this->hasMany(Booking::class);
    }

    public function booking(){
        return $this->hasOne(Booking::class)
        ->whereIn('status',['active', 'pending'])
        ->latest    ();
    }

    public function house(){
        return $this->belongsTo(House::class);
    }

    protected function ownershipPath(): string{
        return 'house';
    }
}
