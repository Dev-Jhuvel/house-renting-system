<?php

namespace App\Models\Traits;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\SoftDeletes;

trait HasUuidAndSoftDeletes
{
    use SoftDeletes;

    public static function bootHasUuidAndSoftDeletes()
    {
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }

    public function initializeHasUuidAndSoftDeletes()
    {
        $this->incrementing = false;
        $this->keyType = 'string';
    }
}
