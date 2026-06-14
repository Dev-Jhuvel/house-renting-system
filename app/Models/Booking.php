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
        'status',
        'notes'
    ];

    public function tenant(){
        return $this->belongsTo(Tenant::class);
    }

    public function room(){
        return $this->belongsTo(Room::class);
    }

    public function bills(){
        return $this->hasMany(Bill::class);
    }
}
