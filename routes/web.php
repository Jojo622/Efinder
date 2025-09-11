<?php

use App\Http\Controllers\Client\PropertyController;
use App\Http\Controllers\Client\CustomerController;
use App\Http\Controllers\Client\UserController;
use App\Http\Controllers\WelcomeController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/', [WelcomeController::class, 'index'])->name('welcome');

Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

Route::prefix('client')->middleware(['auth:web'])->group(function() {
    Route::resource('properties', PropertyController::class);
    Route::resource('customers', CustomerController::class)->only(['index','edit','update']);
    Route::resource('users', UserController::class)->only(['index','edit','update']);
});
