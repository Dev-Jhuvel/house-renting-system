<?php

namespace App\Models;

use App\Models\Traits\HasActivityLog;
use App\Models\Traits\HasUuidAndSoftDeletes;
use App\Models\Traits\OwnedByUser;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bill extends Model
{
    use HasUuidAndSoftDeletes, HasActivityLog, OwnedByUser, HasFactory;
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

    protected function casts() :array
    {
        return [
            'amount'            => 'decimal:2',
            'previous_reading'  => 'decimal:2',
            'current_reading'   => 'decimal:2',
            'rate_used'         => 'decimal:2',
        ];
    }

    protected $appends = ['remaining_balance', 'total_paid'];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function getRemainingBalanceAttribute(){
        return $this->amount - $this->total_paid;
    }   
    
    public function getTotalPaidAttribute(){
        return $this->payments()->sum('amount_paid');
    }  

    protected function ownershipPath(): string{
        return 'booking.room.house';
    }
}
