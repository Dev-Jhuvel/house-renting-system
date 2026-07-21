<?php

namespace App\Models\Traits;

use Illuminate\Database\Eloquent\Builder;

trait OwnedByUser
{
    /**
     * Scope a query to only records belonging to houses owned by the given user.
     */
    public function scopeOwnedBy(Builder $query, string $userId): Builder
    {
        $path = $this->ownershipPath();
        
        if ($path === null) {
            return $query->where($this->ownershipColumn(), $userId);
        }
        return $query->whereHas($path, fn ($q) => $q->where('user_id', $userId));
    }

    public function isOwnedBy(string $userId): bool
    {
        return static::ownedBy($userId)->whereKey($this->getKey())->exists();
    }
    protected function ownershipColumn(): string
    {
        return 'user_id';
    }

    /**
     * The dot-notation relationship path from this model to the House model.
     */
    abstract protected function ownershipPath(): ?string;
}
