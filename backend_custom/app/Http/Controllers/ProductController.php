<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Product::with('operator');

        if ($user->role === 'operator') {
            $query->where('operator_id', $user->id);
        }

        $products = $query->orderByDesc('created_at')->get()->map(function ($p) {
            return [
                'id'              => $p->id,
                'date'            => $p->created_at->toDateTimeString(),
                'image_url'       => $p->image_path ? Storage::disk('public')->url($p->image_path) : null,
                'ref_link1'       => $p->ref_link1,
                'ref_link2'       => $p->ref_link2,
                'ref_link3'       => $p->ref_link3,
                'reason'          => $p->reason,
                'differentiation' => $p->differentiation,
                'review_status'   => $p->review_status,
                'operator_name'   => $p->operator?->name,
            ];
        });

        return response()->json($products);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'image'          => 'required|image',
            'ref_link1'      => 'required|url',
            'ref_link2'      => 'nullable|url',
            'ref_link3'      => 'nullable|url',
            'reason'         => 'required|string',
            'differentiation'=> 'required|string',
        ]);

        $path = $request->file('image')->store('products', 'public');

        $product = Product::create([
            'operator_id'     => $user->id,
            'image_path'      => $path,
            'ref_link1'       => $data['ref_link1'],
            'ref_link2'       => $data['ref_link2'] ?? null,
            'ref_link3'       => $data['ref_link3'] ?? null,
            'reason'          => $data['reason'],
            'differentiation' => $data['differentiation'],
            'review_status'   => 'pending',
        ]);

        return response()->json($product, 201);
    }

    public function updateReview(Request $request, Product $product)
    {
        $user = $request->user();

        $data = $request->validate([
            'result'  => 'required|in:approved,rejected',
            'comment' => 'nullable|string',
        ]);

        $product->review_status = $data['result'];
        $product->save();

        ProductReview::create([
            'product_id'  => $product->id,
            'reviewer_id' => $user->id,
            'result'      => $data['result'],
            'comment'     => $data['comment'] ?? null,
        ]);

        return response()->json(['message' => 'Review updated']);
    }

    public function show(Product $product)
    {
        $product->load('operator', 'reviews.reviewer');

        return response()->json($product);
    }
}
