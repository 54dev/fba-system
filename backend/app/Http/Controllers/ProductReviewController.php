<?php

namespace App\Http\Controllers;

use App\Models\ProductReview;

class ProductReviewController extends Controller
{
    // 审核记录列表
    public function index()
    {
        $reviews = ProductReview::with(['product', 'reviewer'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($reviews);
    }
}
