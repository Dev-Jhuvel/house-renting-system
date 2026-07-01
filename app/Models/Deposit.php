<?php

namespace App\Models;

use App\Models\Traits\HasActivityLog;
use App\Models\Traits\HasUuidAndSoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Deposit extends Model
{
    use HasUuidAndSoftDeletes, HasActivityLog;

    protected $fillable = [
        'booking_id',
        'amount',
        'paid_at',
        'notes',
        'type'
    ];

    public function booking(){
        return $this->belongsTo(Booking::class);
    }
}
