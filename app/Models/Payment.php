<?php

namespace App\Models;

use App\Models\Traits\HasActivityLog;
use App\Models\Traits\HasUuidAndSoftDeletes;
use App\Models\Traits\OwnedByUser;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasUuidAndSoftDeletes, HasActivityLog, OwnedByUser;

    protected $fillable = [
        'bill_id',
        'amount_paid',
        'paid_at',
        'method',
        'reference_number',
        'proof_photo',
        'status'
    ];

    public function bill(){
        return $this->belongsTo(Bill::class);
    }

    protected function ownershipPath(): string{
        return 'bill.booking.room.house';
    }
}
