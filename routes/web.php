<?php

use App\Http\Controllers\BillController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DepositController;
use App\Http\Controllers\HouseController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\TenantController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

Route::middleware(['auth', 'role:landlord,admin'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('houses', HouseController::class);
    Route::resource('rooms', RoomController::class);
    Route::resource('tenants', TenantController::class);
    Route::resource('bookings', BookingController::class);
    Route::resource('bills', BillController::class);

    Route::patch('bookings/{booking}/status', [BookingController::class, 'updateBookingStatus'])->name('booking.updateBookingStatus');
    Route::patch('rooms/{room}/status', [RoomController::class, 'updateRoomStatus'])->name('room.updateRoomStatus');

    Route::post('bills/{bill}/payments', [PaymentController::class, 'store'])->name('bills.payments.store');
    Route::delete('bills/{bill}/payments/{payment}', [PaymentController::class, 'destroy'])->name('bills.payments.destroy');
    Route::post('bookings/{booking}/deposits', [DepositController::class, 'store'])->name('bookings.deposits.store');
    Route::delete('deposits/{deposit}', [DepositController::class, 'destroy'])->name('deposits.destroy');
});

require __DIR__ . '/auth.php';
