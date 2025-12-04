<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Product;
use App\Models\LoginLog;

class DashboardController extends Controller
{
    public function index()
    {
        // 产品统计
        $totalProducts    = Product::count();
        $approvedProducts = Product::where('review_result', 'approved')->count();
        $rejectedProducts = Product::where('review_result', 'rejected')->count();
        $pendingProducts  = Product::where('review_result', 'pending')->count();

        // 用户角色统计
        $operators = User::where('role', 'operator')->count();
        $reviewers = User::where('role', 'reviewer')->count();

        // 最近登录日志
        $recentLogins = LoginLog::with('user')
            ->orderBy('logged_in_at', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'total_products'    => $totalProducts,
            'approved_products' => $approvedProducts,
            'rejected_products' => $rejectedProducts,
            'pending_products'  => $pendingProducts,
            'operators'         => $operators,
            'reviewers'         => $reviewers,
            'recent_logins'     => $recentLogins,
        ]);
    }
}
