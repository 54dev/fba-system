<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Product;
use App\Models\ProductReview;
use App\Models\LoginLog;

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'total_products' => Product::count(),
            'total_reviews' => ProductReview::count(),
            'total_users' => User::count(),
            'recent_logins' => LoginLog::with('user')
                ->orderBy('logged_in_at', 'desc')
                ->limit(5)
                ->get()
        ]);
    }
}
