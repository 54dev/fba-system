<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductReviewController;
use App\Http\Controllers\LoginLogController;
use App\Http\Controllers\UserController;

// 登录
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Dashboard
    Route::get('/dashboard', [ProductController::class, 'dashboard']);

    // 产品管理
    Route::get('/products', [ProductController::class, 'index']);
    Route::post('/products', [ProductController::class, 'store']);

    // 产品详情（你新需求必备）
    Route::get('/products/{id}', [ProductController::class, 'show']);

    // 审核产品
    Route::put('/products/{product}/review', [ProductController::class, 'updateReview'])
        ->middleware('role:admin,reviewer');

    // 审核记录
    Route::get('/reviews', [ProductReviewController::class, 'index'])
        ->middleware('role:admin,reviewer');

    // 登录日志（只有管理员）
    Route::get('/login-logs', [LoginLogController::class, 'index'])
        ->middleware('role:admin');

    // 用户管理（管理员）
    Route::get('/users', [UserController::class, 'index'])
        ->middleware('role:admin');
    Route::post('/users', [UserController::class, 'store'])
        ->middleware('role:admin');

    // 用户详情（管理员、审核员都能看）
    Route::get('/users/{id}', [UserController::class, 'show']);

    // 用户更新（仅管理员）
    Route::put('/users/{id}', [UserController::class, 'update'])
        ->middleware('role:admin');
});
