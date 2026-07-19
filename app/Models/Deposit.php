<?php

namespace App\Models;

use App\Models\Traits\HasActivityLog;
use App\Models\Traits\HasUuidAndSoftDeletes;
use App\Models\Traits\OwnedByUser;
use Illuminate\Database\Eloquent\Model;

class Deposit extends Model
{
    use HasUuidAndSoftDeletes, HasActivityLog, OwnedByUser;

    protected $fillable = [
        'booking_id',
        'amount',
        'paid_at',
        'notes',
        'type'
    ];

    protected function casts() :array
    {
        return [
            'amount'        => 'decimal:2'
        ];
    }

    public function booking(){
        return $this->belongsTo(Booking::class);
    }

    protected function ownershipPath(): string{
        return 'booking.room.house';
    }
}
