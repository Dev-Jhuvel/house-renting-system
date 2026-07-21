<?php

namespace App\Models;

use App\Models\Traits\HasActivityLog;
use App\Models\Traits\HasUuidAndSoftDeletes;
use App\Models\Traits\OwnedByUser;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\Builder;
use Override;

class Tenant extends Model
{
    use HasUuidAndSoftDeletes, HasActivityLog, OwnedByUser, HasFactory;
    protected $fillable = [
        'user_id',
        'created_by',
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
        return 'created_by';
    }

    /**
     * Overrides the trait's default scopeOwnedBy(). A Tenant is visible to
     * a landlord either because that landlord created them directly
     * (walk-in tenant, no booking yet), or because the tenant has a
     * booking on one of that landlord's rooms (self-registered tenant
     * who inquired). Every other model in the app keeps using the
     * trait's version untouched — this is Tenant-specific because it's
     * the only model whose ownership isn't a single fixed path.
     */
    public function scopeOwnedBy($query, string $userId)
    {
        return $query->where(function ($q) use ($userId) {
            $q->where($this->ownershipColumn(), $userId)
                ->orWhereHas('bookings.room.house', function ($q2) use ($userId) {
                    $q2->where('user_id', $userId);
                });
        });
    }
}
