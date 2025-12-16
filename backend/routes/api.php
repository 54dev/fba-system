<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductReviewController;
use App\Http\Controllers\LoginLogController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// 登录（不需要鉴权）
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | 认证
    |--------------------------------------------------------------------------
    */
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    /*
    |--------------------------------------------------------------------------
    | Dashboard
    |--------------------------------------------------------------------------
    */
    Route::get('/dashboard', [ProductController::class, 'dashboard']);

    /*
    |--------------------------------------------------------------------------
    | 产品管理
    |--------------------------------------------------------------------------
    */
    // 列表
    Route::get('/products', [ProductController::class, 'index']);

    // 创建
    Route::post('/products', [ProductController::class, 'store']);

    // ⭐ 更新（编辑页必须，POST + FormData + _method）
    Route::post('/products/{product}', [ProductController::class, 'update']);

    // ⭐ 详情（统一参数名，保证 Route Model Binding）
    Route::get('/products/{product}', [ProductController::class, 'show']);

    /*
    |--------------------------------------------------------------------------
    | 审核产品（权限在 Controller 内判断）
    |--------------------------------------------------------------------------
    */
    Route::put('/products/{product}/review', [ProductController::class, 'updateReview']);

    /*
    |--------------------------------------------------------------------------
    | 审核记录
    |--------------------------------------------------------------------------
    */
    Route::get('/reviews', [ProductReviewController::class, 'index']);

    /*
    |--------------------------------------------------------------------------
    | 登录日志
    |--------------------------------------------------------------------------
    */
    Route::get('/login-logs', [LoginLogController::class, 'index']);

    /*
    |--------------------------------------------------------------------------
    | 用户管理
    |--------------------------------------------------------------------------
    */
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
});
