<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LogController;

Route::post('/logs', [LogController::class, 'store'])
    ->middleware('log.key');

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:api');