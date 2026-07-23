<?php

namespace App\Models;

use App\Models\Traits\HasActivityLog;
use App\Models\Traits\HasUuidAndSoftDeletes;
use App\Models\Traits\OwnedByUser;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class House extends Model
{
    use HasUuidAndSoftDeletes, HasActivityLog, OwnedByUser, HasFactory;
    protected $fillable = [
        'user_id',
        'name',
        'description',
        'address',
        'city',
        'latitude',
        'longitude',
        'max_floor',
        'max_room',
        'water_rate',
        'electric_rate',
        'status'
    ];

    protected function casts(): array
    {
        return [
            'max_floor'     => 'integer',
            'max_room'      => 'integer',
            'water_rate'    => 'decimal:2',
            'electric_rate' => 'decimal:2',
        ];
    }

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function rooms(){
        return $this->hasMany(Room::class);
    }

    protected function ownershipPath(): ?string{
        return null;
    }
}
