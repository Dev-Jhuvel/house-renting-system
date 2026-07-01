<?php

namespace App\Models;

use App\Models\Traits\HasActivityLog;
use App\Models\Traits\HasUuidAndSoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Bill extends Model
{
    use HasUuidAndSoftDeletes, HasActivityLog;
    protected $fillable = [
        'booking_id',
        'type',
        'title',
        'amount',
        'previous_reading',
        'current_reading',
        'rate_used',
        'bill_date',
        'due_date',
        'status',   
        'notes'
    ];

    protected $appends = ['remaining_balance'];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function getRemainingBalanceAttribute(){
        return $this->amount - $this->payments()->sum('amount_paid');
    }   
}
