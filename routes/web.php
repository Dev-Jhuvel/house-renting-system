<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\BillController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\DepositController;
use App\Http\Controllers\HouseController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RegisteredTenantController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\TenantController;
use App\Http\Controllers\TenantDashboardController;
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

Route::middleware('auth')->get('/dashboard', function(){
    $role = auth()->user()->role;
    return match ($role){
        'tenant' => app(TenantDashboardController::class)->index(),
        'landlord', 'admin' => app(AdminDashboardController::class)->index(),
        default => abort(403)
    };
   
})->name('dashboard');
    
Route::middleware(['auth', 'role:tenant'])->group(function(){
    Route::get('/tenant', [RegisteredTenantController::class, 'index'])->name('register.tenant.index');
    Route::post('/tenant/store', [RegisteredTenantController::class, 'store'])->name('register.tenant.store');
    Route::get('/bookings/{booking}', [BookingController::class, 'show'])->name('bookings.show');
    Route::get('/bills/{bill}', [BillController::class, 'show'])->name('bills.show');
    Route::get('/bills/{bill}/payments', [BillController::class, 'store'])->name('bills.payments.store');
});

Route::middleware(['auth', 'role:landlord,admin'])->group(function () {

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('houses', HouseController::class);
    Route::resource('rooms', RoomController::class);
    Route::resource('tenants', TenantController::class);
    Route::resource('bookings', BookingController::class);
    Route::resource('bills', BillController::class);

    # Bookings
    Route::patch('bookings/{booking}/status', [BookingController::class, 'updateBookingStatus'])->name('booking.updateBookingStatus');
    Route::post('bookings/{booking}/deposits', [DepositController::class, 'store'])->name('bookings.deposits.store');
    # Rooms
    Route::patch('rooms/{room}/status', [RoomController::class, 'updateRoomStatus'])->name('room.updateRoomStatus');
    # Bills
    Route::post('bills/{bill}/payments', [PaymentController::class, 'store'])->name('bills.payments.store');
    Route::delete('bills/{bill}/payments/{payment}', [PaymentController::class, 'destroy'])->name('bills.payments.destroy');
    # Deposits
    Route::delete('deposits/{deposit}', [DepositController::class, 'destroy'])->name('deposits.destroy');
    # Payments
    Route::post('payments/{payment}/approve', [PaymentController::class, 'approve'])->name('payments.approve');
    Route::post('payments/{payment}/reject', [PaymentController::class, 'reject'])->name('payments.reject');
});

require __DIR__ . '/auth.php';
