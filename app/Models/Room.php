<?php

namespace App\Models;

use App\Models\Traits\HasActivityLog;
use App\Models\Traits\HasUuidAndSoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasUuidAndSoftDeletes, HasActivityLog;
    protected $fillable = [
        'house_id',
        'room_number',
        'floor',
        'type',
        'monthly_rent',
        'capacity',
        'status',
        'description'
    ];

    public function booking(){
        return $this->belongsTo(Tenant::class);
    }

    public function house(){
        return $this->belongsTo(House::class);
    }
}
