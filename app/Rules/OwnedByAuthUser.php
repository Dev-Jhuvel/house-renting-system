<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Auth;

class OwnedByAuthUser implements ValidationRule
{

    public function __construct(
        private string $modelClass
    )
    {}
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $exists = ($this->modelClass)::ownedBy(Auth::id())
            ->whereKey($value)
            ->exists();

        if(! $exists){
            $fail('The selected '. str($attribute)->replace('_id', '')->repalce('_', ' '). ' is invalid.');
        }
    }
}
