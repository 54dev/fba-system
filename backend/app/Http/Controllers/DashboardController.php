<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Product;
use App\Models\LoginLog;

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'total_products'   => Product::count(),
            'approved_products' => Product::where('review_result', 'approved')->count(),
            'pending_products'  => Product::where('review_result', 'pending')->count(),
            'rejected_products' => Product::where('review_result', 'rejected')->count(),

            'operator_count' => User::where('role', 'operator')->count(),
            'reviewer_count' => User::where('role', 'reviewer')->count(),

            'recent_logins' => LoginLog::with('user')
                ->orderBy('logged_in_at', 'desc')
                ->limit(5)
                ->get()
        ]);
    }
}
