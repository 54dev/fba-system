<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductReviewController;
use App\Http\Controllers\LoginLogController;
use App\Http\Controllers\UserController;

// Sanctum 中间件别名会在 app.php 中注册
// 这里无需 use App\Http\Middleware\RoleMiddleware;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Dashboard
    Route::get('/dashboard', [ProductController::class, 'dashboard']);

    // 产品：列表 + 新建
    Route::get('/products', [ProductController::class, 'index']);
    Route::post('/products', [ProductController::class, 'store']);

    // 审核产品（只有审核员 / 管理员）
    Route::put('/products/{product}/review', [ProductController::class, 'updateReview'])
        ->middleware('role:admin,reviewer');

    // 审核记录（审核员 + 管理员）
    Route::get('/reviews', [ProductReviewController::class, 'index'])
        ->middleware('role:admin,reviewer');

    // 登录日志（只有管理员）
    Route::get('/login-logs', [LoginLogController::class, 'index'])
        ->middleware('role:admin');

    // 用户管理（只有管理员）
    Route::get('/users', [UserController::class, 'index'])
        ->middleware('role:admin');

    Route::post('/users', [UserController::class, 'store'])
        ->middleware('role:admin');
});