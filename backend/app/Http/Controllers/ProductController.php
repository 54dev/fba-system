<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    // 主页统计信息（给 /api/dashboard 用）
    public function dashboard()
    {
        $totalProducts      = Product::count();
        $approvedProducts   = Product::where('review_result', 'approved')->count();
        $rejectedProducts   = Product::where('review_result', 'rejected')->count();
        $pendingProducts    = Product::where('review_result', 'pending')->count();

        $operators = \App\Models\User::where('role', 'operator')->count();
        $reviewers = \App\Models\User::where('role', 'reviewer')->count();

        return response()->json([
            'total_products'    => $totalProducts,
            'approved_products' => $approvedProducts,
            'rejected_products' => $rejectedProducts,
            'pending_products'  => $pendingProducts,
            'operators'         => $operators,
            'reviewers'         => $reviewers,
        ]);
    }

    // 产品列表
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Product::with('user');

        // 操作员只能看自己提交的
        if ($user->role === 'operator') {
            $query->where('user_id', $user->id);
        }

        $products = $query->orderBy('created_at', 'desc')->get();

        return response()->json($products);
    }

    // 提交产品
    public function store(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'image'             => 'required|image|max:4096',
            'reference_link_1'  => 'required|url',
            'reference_link_2'  => 'nullable|url',
            'reference_link_3'  => 'nullable|url',
            'reason'            => 'required|string',
            'differentiation'   => 'required|string',
        ]);

        // 保存图片到 storage/app/public/products
        $path = $request->file('image')->store('products', 'public');

        $product = Product::create([
            'user_id'          => $user->id,
            'image_path'       => $path,
            'reference_link_1' => $data['reference_link_1'],
            'reference_link_2' => $data['reference_link_2'] ?? null,
            'reference_link_3' => $data['reference_link_3'] ?? null,
            'reason'           => $data['reason'],
            'differentiation'  => $data['differentiation'],
            'review_result'    => 'pending',
        ]);

        return response()->json($product, 201);
    }

    // 审核产品（审核员 / 管理员）
    public function updateReview(Request $request, Product $product)
    {
        $user = $request->user();

        $data = $request->validate([
            'result'  => 'required|in:pending,approved,rejected',
            'comment' => 'nullable|string',
        ]);

        // 更新产品上的审核结果
        $product->review_result = $data['result'];
        $product->save();

        // 记录审核日志
        ProductReview::create([
            'product_id'  => $product->id,
            'reviewer_id' => $user->id,
            'result'      => $data['result'],
            'comment'     => $data['comment'] ?? null,
        ]);

        return response()->json(['message' => '审核结果已更新']);
    }
}
