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
        return $query->whereHas($this->ownershipPath(), fn ($q) => $q->where('user_id', $userId));
    }

    /**
     * The dot-notation relationship path from this model to the House model.
     */
    abstract protected function ownershipPath(): ?string;
}