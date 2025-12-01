<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductReviewController;
use App\Http\Controllers\LoginLogController;
use App\Http\Middleware\RoleMiddleware;

Route::post('/login', [LoginController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [LoginController::class, 'me']);
    Route::post('/logout', [LoginController::class, 'logout']);

    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::get('/products', [ProductController::class, 'index']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::get('/products/{product}', [ProductController::class, 'show']);

    Route::put('/products/{product}/review', [ProductController::class, 'updateReview'])
        ->middleware([RoleMiddleware::class . ':admin,reviewer']);

    Route::get('/reviews', [ProductReviewController::class, 'index'])
        ->middleware([RoleMiddleware::class . ':admin,reviewer']);

    Route::get('/login-logs', [LoginLogController::class, 'index'])
        ->middleware([RoleMiddleware::class . ':admin']);
});
