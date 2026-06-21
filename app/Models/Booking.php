<?php

namespace App\Models;

use App\Models\Traits\HasActivityLog;
use App\Models\Traits\HasUuidAndSoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasUuidAndSoftDeletes, HasActivityLog;
    protected $fillable = [
        'tenant_id',
        'room_id',
        'move_in_date',
        'move_out_date',
        'deposit_amount',
        'due_day',
        'notes',
        'status'
    ];

    protected $appends = ['total_bills', 'total_paid', 'balance'];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function bills()
    {
        return $this->hasMany(Bill::class);
    }

    public function unpaid_bills()
    {
        return $this->hasMany(Bill::class)
            ->whereNot('status', 'paid')
            ->latest();
    }

    public function getTotalBillsAttribute()
    {
        return $this->bills->sum('amount');
    }

    public function getTotalPaidAttribute()
    {
        return $this->bills->flatMap->payments->sum('amount_paid');
    }

    public function getBalanceAttribute()
    {
        return $this->total_bills - $this->total_paid;
    }
}
