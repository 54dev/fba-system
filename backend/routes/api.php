<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductReviewController;
use App\Http\Controllers\LoginLogController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\RoleMiddleware;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // 主页统计信息
    Route::get('/dashboard', [ProductController::class, 'dashboard']);

    // 产品列表 + 提交产品
    Route::get('/products', [ProductController::class, 'index']);
    Route::post('/products', [ProductController::class, 'store']);

    // 审核产品（审核员 + 管理员）
    Route::put('/products/{product}/review', [ProductController::class, 'updateReview'])
        ->middleware(RoleMiddleware::class . ':admin,reviewer');

    // 审核记录列表（审核员 + 管理员）
    Route::get('/reviews', [ProductReviewController::class, 'index'])
        ->middleware(RoleMiddleware::class . ':admin,reviewer');

    // 登录日志（只有管理员）
    Route::get('/login-logs', [LoginLogController::class, 'index'])
        ->middleware(RoleMiddleware::class . ':admin');

    // 用户管理（只有管理员：创建审核员/操作员）
    Route::get('/users', [UserController::class, 'index'])
        ->middleware(RoleMiddleware::class . ':admin');
    Route::post('/users', [UserController::class, 'store'])
        ->middleware(RoleMiddleware::class . ':admin');
});
