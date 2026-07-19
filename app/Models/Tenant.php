<?php

namespace App\Models;

use App\Models\Traits\HasActivityLog;
use App\Models\Traits\HasUuidAndSoftDeletes;
use App\Models\Traits\OwnedByUser;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\Builder;
use Override;

class Tenant extends Model
{
    use HasUuidAndSoftDeletes, HasActivityLog, OwnedByUser;
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

    protected function ownershipPath(): ?string{
        return null;
    }

    protected function ownershipColumn(): string
    {
        return 'landlord_user_id';
    }
}
