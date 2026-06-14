<?php

namespace App\Models;

use App\Models\Traits\HasActivityLog;
use App\Models\Traits\HasUuidAndSoftDeletes;
use Illuminate\Database\Eloquent\Model;

class House extends Model
{
    use HasUuidAndSoftDeletes, HasActivityLog;
    protected $fillable = [
        'user_id',
        'name',
        'address',
        'description',
        'city',
        'max_floor',
        'max_room',
        'water_rate',
        'electric_rate',
        'status'
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function owner(){
        return $this->belongsTo(User::class);
    }

    public function rooms(){
        return $this->hasMany(Room::class);
    }
}
