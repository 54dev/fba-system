<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductReviewController;
use App\Http\Controllers\LoginLogController;

// 登录
Route::post('/login', [AuthController::class, 'login']);

// 需要登录的接口
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // 仪表盘统计
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // 产品列表 & 添加
    Route::get('/products', [ProductController::class, 'index']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::get('/products/{product}', [ProductController::class, 'show']);

    // 审核（管理员 + 审核员）
    Route::put('/products/{product}/review', [ProductController::class, 'updateReview'])
        ->middleware('role:admin,reviewer');

    Route::post('/users', [UserController::class, 'store'])
        ->middleware('role:admin');
    

    // 登录日志（仅管理员）
    Route::get('/login-logs', [LoginLogController::class, 'index'])
        ->middleware('role:admin');
});
