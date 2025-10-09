<?php
use App\Http\Controllers\Client\DashboardController;
use App\Http\Controllers\Client\InvoiceController;
use App\Http\Controllers\Client\OwnerController;
use App\Http\Controllers\Client\PropertyController;
use App\Http\Controllers\Client\ReservationController;
use App\Http\Controllers\Client\TenantController;
use App\Http\Controllers\Client\TicketController;
use App\Http\Controllers\Public\PropertyFrontendController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [PropertyFrontendController::class, 'home'])->name('home');

Route::get('/available-listings', [PropertyFrontendController::class, 'availableListings'])
    ->name('available-listings');

Route::post('/availability-request', [PropertyFrontendController::class, 'requestAvailability'])
    ->name('availability.request');

Route::get('/map-tracker', [PropertyFrontendController::class, 'mapTracker'])
    ->name('map-tracker');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::resource('properties', PropertyController::class);

    Route::get('reservations/properties/{property}', [PropertyFrontendController::class, 'show'])
        ->name('tenant.properties.show');

    Route::patch('owners/{owner}/update-user', [OwnerController::class, 'updateUser'])
        ->name('owners.update-user');

    Route::resource('owners', OwnerController::class)
        ->only(['index', 'edit', 'update', 'destroy']);

    Route::resource('tenants', TenantController::class)
        ->only(['index', 'edit', 'update', 'destroy']);

    Route::resource('reservations', ReservationController::class)
        ->only(['index', 'store']);

    Route::post('reservations/{reservation}/confirm-tenant', [ReservationController::class, 'confirmTenant'])
        ->name('reservations.confirm-tenant');

    Route::get('payments-invoices', [InvoiceController::class, 'index'])->name('payments.index');

    Route::get('ticket-concerns', [TicketController::class, 'index'])->name('ticket.concerns');
    Route::get('ticket-concerns/create', [TicketController::class, 'create'])->name('ticket.concerns.create');
    Route::post('ticket-concerns', [TicketController::class, 'store'])->name('ticket.concerns.store');
    Route::patch('ticket-concerns/{ticket}', [TicketController::class, 'update'])->name('ticket.concerns.update');

    Route::prefix('invoices')->name('invoices.')->group(function (): void {
        Route::get('create', [InvoiceController::class, 'create'])->name('create');
        Route::post('/', [InvoiceController::class, 'store'])->name('store');
        Route::get('{invoice}', [InvoiceController::class, 'show'])->name('show');
    });

    Route::get('revenue-insights', function () {
        return Inertia::render('revenue-insights');
    })->name('revenue.insights');

    Route::get('forbidden', function () {
        return Inertia::render('forbidden');
    })->name('forbidden');

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
