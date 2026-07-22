<?php

namespace App\Models;

use App\Models\Traits\HasActivityLog;
use App\Models\Traits\HasUuidAndSoftDeletes;
use App\Models\Traits\OwnedByUser;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasUuidAndSoftDeletes, HasActivityLog, OwnedByUser, HasFactory;

    protected $fillable = [
        'bill_id',
        'amount_paid',
        'paid_at',
        'method',
        'reference_number',
        'proof_photo',
        'submitted_by',
        'rejection_reason',
        'status'
    ];

    protected function casts(): array
    {
        return [
            'amount_paid'   => 'decimal:2',
        ];
    }

    public function bill(){
        return $this->belongsTo(Bill::class);
    }

    protected function ownershipPath(): string{
        return 'bill.booking.room.house';
    }
}
