<?php

namespace App\Models\Traits;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

trait HasUuidSoftDeletesActivityLog
{
    use SoftDeletes, LogsActivity;

    protected static function bootHasUuidSoftDeletesActivityLog()
    {
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                logger()->info('UUID generator fired for ' . class_basename($model));
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }


    public function initializeHasUuidSoftDeletesActivityLog()
    {
        $this->incrementing = false;
        $this->keyType = 'string';
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->useLogName(strtolower(class_basename($this)))
            ->logOnly(['name', 'email']) // choose safe attributes
            ->logOnlyDirty()
            ->setDescriptionForEvent(fn(string $eventName) => class_basename($this) . " has been {$eventName}");
    }
}
