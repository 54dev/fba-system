<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductReviewController;
use App\Http\Controllers\LoginLogController;
use App\Http\Middleware\RoleMiddleware;

// 登录（不需要 Sanctum）
Route::post('/login', [AuthController::class, 'login']);

// 需要登录的接口
Route::middleware('auth:sanctum')->group(function () {

    // 当前用户
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // 仪表盘
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // 产品列表 / 新增 / 详情
    Route::get('/products', [ProductController::class, 'index']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::get('/products/{product}', [ProductController::class, 'show']);

    // 审核记录修改（管理员 + 审核员）
    Route::put('/products/{product}/review', [ProductController::class, 'updateReview'])
        ->middleware([RoleMiddleware::class . ':admin,reviewer']);

    // 审核记录列表（管理员 + 审核员）
    Route::get('/reviews', [ProductReviewController::class, 'index'])
        ->middleware([RoleMiddleware::class . ':admin,reviewer']);

    // 登录日志（只有管理员）
    Route::get('/login-logs', [LoginLogController::class, 'index'])
        ->middleware([RoleMiddleware::class . ':admin']);
});
