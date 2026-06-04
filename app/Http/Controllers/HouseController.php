<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class HouseController extends Controller
{
    public function index(){
        return Inertia::render('HousePage');
    }

    public function store(Request $request){
        $validated
    }
}
