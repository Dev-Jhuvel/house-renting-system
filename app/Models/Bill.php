<?php

namespace App\Models;

use App\Models\Traits\HasActivityLog;
use App\Models\Traits\HasUuidAndSoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Bill extends Model
{
    use HasUuids, HasActivityLog;
    protected $fillable = [
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

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function bill_payment()
    {
        return $this->hasMany(BillPayment::class);
    }
}
