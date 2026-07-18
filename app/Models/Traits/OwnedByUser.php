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
            return $query->where('user_id', $userId);
        }
        return $query->whereHas($path, fn ($q) => $q->where('user_id', $userId));
    }

    public function isOwnedBy(string $userId): bool
    {
        $path = $this->ownershipPath();
        if($path === null){
            return $this->user_id === $userId;
        }

        return data_get($this, $path)?->user_id === $userId;
    }

    /**
     * The dot-notation relationship path from this model to the House model.
     */
    abstract protected function ownershipPath(): ?string;
}