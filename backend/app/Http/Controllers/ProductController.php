<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductReview;
use App\Models\User; // ✅【关键修复点】补上 User Model
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Dashboard 数量统计
     */
    public function dashboard(Request $request)
    {
        $user = $request->user();

        // 管理员 & 审核员：查看全站产品
        if (in_array($user->role, ['admin', 'reviewer'])) {
            $total = Product::count();
            $approved = Product::where('review_result', 'approved')->count();
            $rejected = Product::where('review_result', 'rejected')->count();
            $pending = Product::where('review_result', 'pending')->count();

            return response()->json([
                'total_products' => $total,
                'approved_products' => $approved,
                'rejected_products' => $rejected,
                'pending_products' => $pending,
                'operator_count' => User::where('role', 'operator')->count(),
                'reviewer_count' => User::where('role', 'reviewer')->count(),
            ]);
        }

        // 操作员：只能看自己的产品数据
        if ($user->role === 'operator') {
            $total = Product::where('user_id', $user->id)->count();
            $approved = Product::where('user_id', $user->id)
                ->where('review_result', 'approved')->count();
            $rejected = Product::where('user_id', $user->id)
                ->where('review_result', 'rejected')->count();
            $pending = Product::where('user_id', $user->id)
                ->where('review_result', 'pending')->count();

            return response()->json([
                'total_products' => $total,
                'approved_products' => $approved,
                'rejected_products' => $rejected,
                'pending_products' => $pending,
                'operator_count' => 0,
                'reviewer_count' => 0,
            ]);
        }

        return response()->json(['message' => 'Role not recognized'], 400);
    }

    /**
     * 产品列表
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Product::with('user:id,name', 'review')
            ->orderBy('id', 'desc');

        if ($user->role === 'operator') {
            $query->where('user_id', $user->id);
        }

        $products = $query->get();

        foreach ($products as $p) {
            if ($p->image) {
                $p->image = url('storage/' . $p->image);
            }
        }

        return response()->json($products);
    }

    /**
     * 提交新产品
     */
    public function store(Request $request)
    {
        $request->validate([
            'asin'  => 'required|string',
            'title' => 'required|string',
            'image' => 'nullable|file|image',
            'ref1'  => 'nullable|string',
            'ref2'  => 'nullable|string',
            'ref3'  => 'nullable|string',
        ]);

        $path = null;

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
        }

        $product = Product::create([
            'asin'    => $request->asin,
            'title'   => $request->title,
            'image'   => $path,
            'ref1'    => $request->ref1,
            'ref2'    => $request->ref2,
            'ref3'    => $request->ref3,
            'user_id' => $request->user()->id,
            'status'  => 'pending',
        ]);

        return response()->json(['message' => '产品已提交', 'product' => $product]);
    }

    /**
     * 产品详情
     */
    public function show(Product $product)
    {
        $product->load('user:id,name', 'review.reviewer:id,name');

        if ($product->image) {
            $product->image = url('storage/' . $product->image);
        }

        return response()->json($product);
    }

    /**
     * 更新产品
     */
    public function update(Request $request, Product $product)
    {
        if ($product->status === 'approved') {
            return response()->json(['message' => '该产品已通过审核，无法编辑'], 403);
        }

        if ($request->user()->role === 'operator' && $product->user_id !== $request->user()->id) {
            return response()->json(['message' => '无权限编辑此产品'], 403);
        }

        $request->validate([
            'asin'  => 'required|string',
            'title' => 'required|string',
            'image' => 'nullable|file|image',
            'ref1'  => 'nullable|string',
            'ref2'  => 'nullable|string',
            'ref3'  => 'nullable|string',
        ]);

        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $product->image = $request->file('image')->store('products', 'public');
        }

        $product->asin  = $request->asin;
        $product->title = $request->title;
        $product->ref1  = $request->ref1;
        $product->ref2  = $request->ref2;
        $product->ref3  = $request->ref3;
        $product->save();

        return response()->json(['message' => '产品已更新', 'product' => $product]);
    }

    /**
     * 审核产品
     */
    public function updateReview(Request $request, Product $product)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
            'reason' => 'nullable|string',
        ]);

        $review = ProductReview::updateOrCreate(
            ['product_id' => $product->id],
            [
                'status'      => $request->status,
                'reason'      => $request->reason,
                'reviewer_id' => $request->user()->id,
            ]
        );

        $product->status = $request->status;
        $product->save();

        return response()->json(['message' => '审核完成', 'review' => $review]);
    }
}
