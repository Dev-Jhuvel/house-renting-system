<?php

namespace App\Models;

use App\Models\Traits\HasActivityLog;
use App\Models\Traits\HasUuidAndSoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Tenant extends Model
{
    use HasUuidAndSoftDeletes, HasActivityLog;
    protected $fillable = [
        'user_id',
        'phone',
        'address',
        'emergency_contact',
        'id_type',
        'id_number',
        'status'
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }
    
    public function bookings(){
        return $this->hasMany(Booking::class);
    }

    public function booking(){
        return $this->hasOne(Booking::class)
        ->whereIn('status',['active', 'pending'])
        ->latest();
    }
}
