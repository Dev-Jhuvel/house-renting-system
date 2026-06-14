<?php

namespace App\Models;

use App\Models\Traits\HasActivityLog;
use App\Models\Traits\HasUuidAndSoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class BillPayment extends Model
{
    use HasUuids, HasActivityLog;

    protected $fillable = [
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
}
