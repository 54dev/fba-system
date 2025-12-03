<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    // 1. 产品列表（权限：操作员只能看自己的）
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Product::with('user');

        // 操作员只能看自己的产品
        if ($user->role === 'operator') {
            $query->where('user_id', $user->id);
        }

        return $query->orderBy('id', 'desc')->get();
    }

    // 2. 添加产品
    public function store(Request $request)
    {
        $validated = $request->validate([
            'image' => 'required|image',
            'reference_link_1' => 'required|string',
            'reference_link_2' => 'nullable|string',
            'reference_link_3' => 'nullable|string',
            'reason' => 'required|string',
            'differentiation' => 'required|string',
        ]);

        // 保存图片
        $path = $request->file('image')->store('products', 'public');

        $product = Product::create([
            'user_id' => $request->user()->id,
            'image_path' => $path,
            'reference_link_1' => $validated['reference_link_1'],
            'reference_link_2' => $validated['reference_link_2'] ?? null,
            'reference_link_3' => $validated['reference_link_3'] ?? null,
            'reason' => $validated['reason'],
            'differentiation' => $validated['differentiation'],
            'review_result' => 'pending',
        ]);

        return response()->json([
            'message' => 'Product created successfully',
            'product' => $product
        ], 201);
    }

    // 3. 查看产品
    public function show(Product $product)
    {
        return $product->load('user');
    }

    // 4. 审核产品（管理员 + 审核员）
    public function updateReview(Request $request, Product $product)
    {
        $validated = $request->validate([
            'result' => 'required|in:approved,rejected',
            'comment' => 'nullable|string',
        ]);

        // 更新产品审核状态
        $product->update([
            'review_result' => $validated['result']
        ]);

        // 写入审核日志
        \App\Models\ReviewLog::create([
            'product_id' => $product->id,
            'reviewer_id' => $request->user()->id,
            'result' => $validated['result'],
            'comment' => $validated['comment'] ?? null,
        ]);

        return response()->json(['message' => 'Review updated']);
    }
}
