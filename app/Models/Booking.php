<?php

namespace App\Models;

use App\Models\Traits\HasActivityLog;
use App\Models\Traits\HasUuidAndSoftDeletes;
use App\Models\Traits\OwnedByUser;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasUuidAndSoftDeletes, HasActivityLog, OwnedByUser, HasFactory;
    protected $fillable = [
        'tenant_id',
        'room_id',
        'move_in_date',
        'move_out_date',
        'notes',
        'status'
    ];

    protected $appends = ['total_bills', 'total_paid', 'balance', 'required_deposit', 'remaining_deposit', 'total_deposit'];

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

    public function deposits()
    {
        return $this->hasMany(Deposit::class);
    }

    public function getRequiredDepositAttribute()
    {
        return $this->room->monthly_rent;
    }

    public function getRemainingDepositAttribute()
    {
        return max(
            0,
            $this->required_deposit - $this->total_deposit
        );
    }
    public function getTotalDepositAttribute()
    {
        $received   =  $this->deposits->where('type', 'received')->sum('amount');
        $deduction  =  $this->deposits->whereIn('type', ['refunded', 'forfeited', 'forfeited', 'applied'])->sum('amount');
        return $received - $deduction;
    }

    protected function ownershipPath(): string{
        return 'room.house';
    }
}
