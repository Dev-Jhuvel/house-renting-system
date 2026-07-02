<?php

namespace App\Enums;

enum BookingStatus: string
{
    case Active     = 'active';
    case Pending    = 'pending';
    case Ended      = 'ended';
    case Canceled   = 'canceled';

    public function label():string {
        return match($this){
            self::Active    => 'Active',
            self::Pending   => 'Pending',
            self::Ended     => 'Ended',
            self::Canceled  => 'Canceled',
        };
    }
}
