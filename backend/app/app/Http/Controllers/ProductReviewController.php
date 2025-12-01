<?php

namespace App\Http\Controllers;

use App\Models\ProductReview;

class ProductReviewController extends Controller
{
    public function index()
    {
        $reviews = ProductReview::with(['product', 'reviewer'])
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($r) {
                return [
                    'id'         => $r->id,
                    'date'       => $r->created_at->toDateTimeString(),
                    'product_id' => $r->product_id,
                    'reviewer'   => $r->reviewer?->name,
                    'result'     => $r->result,
                    'comment'    => $r->comment,
                ];
            });

        return response()->json($reviews);
    }
}
