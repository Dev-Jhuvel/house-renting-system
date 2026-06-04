<?php

namespace App\Models;

use App\Models\Traits\HasActivityLog;
use App\Models\Traits\HasUuidAndSoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Tenant extends Model
{
    use HasUuidAndSoftDeletes, HasActivityLog;
    protected $fillable = [
        'phone',
        'address',
        'emergency_contact',
        'id_type',
        'id_number',
        'is_head',
        'status'
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }
    
    public function room(){
        return $this->hasOne(Room::class);
    }
}
