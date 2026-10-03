<?php

namespace App\Repositories;

use Illuminate\Support\Facades\DB;

class DbRepository{

    public function beginTrans(){
        DB::beginTransaction();        
    }

    public function commit(){
        DB::commit();        
    }

    public function rollback(){
        return DB::rollBack();
    }
}

