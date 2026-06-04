<?php

namespace App\Models;

use App\Models\Traits\HasActivityLog;
use App\Models\Traits\HasUuidAndSoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasUuidAndSoftDeletes, HasActivityLog;
    protected $fillable = [
        'room_number',
        'floor',
        'room_type',
        'single',
        'monthly_rent',
        'capacity',
        'status',
        'description'
    ];

    public function tenants(){
        return $this->hasMany(Tenant::class);
    }

    public function house(){
        return $this->belongsTo(House::class);
    }
}
