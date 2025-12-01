<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\User;

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'operator_count'  => User::where('role', 'operator')->count(),
            'reviewer_count'  => User::where('role', 'reviewer')->count(),
            'product_count'   => Product::count(),
            'approved_count'  => Product::where('review_status', 'approved')->count(),
            'rejected_count'  => Product::where('review_status', 'rejected')->count(),
        ]);
    }
}
