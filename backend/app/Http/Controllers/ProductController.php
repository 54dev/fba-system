<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * 仪表盘统计信息
     * GET /api/dashboard
     */
    public function dashboard()
    {
        $totalProducts    = Product::count();
        $approvedProducts = Product::where('review_result', 'approved')->count();
        $rejectedProducts = Product::where('review_result', 'rejected')->count();
        $pendingProducts  = Product::where('review_result', 'pending')->count();

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

    /**
     * 产品列表
     * GET /api/products
     * - 操作员：只能看到自己提交的
     * - 审核员 / 管理员：看到全部
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Product::with('user');

        if ($user->role === 'operator') {
            $query->where('user_id', $user->id);
        }

        $products = $query
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function (Product $product) {
                return [
                    'id'                => $product->id,
                    'user_id'           => $product->user_id,
                    'user_name'         => optional($product->user)->name,
                    'image_path'        => $product->image_path,
                    'image_url'         => $product->image_path
                        ? Storage::url($product->image_path)
                        : null,
                    'reference_link_1'  => $product->reference_link_1,
                    'reference_link_2'  => $product->reference_link_2,
                    'reference_link_3'  => $product->reference_link_3,
                    'reason'            => $product->reason,
                    'differentiation'   => $product->differentiation,
                    'review_result'     => $product->review_result,
                    'created_at'        => optional($product->created_at)->toDateTimeString(),
                    'updated_at'        => optional($product->updated_at)->toDateTimeString(),
                ];
            });

        return response()->json($products);
    }

    /**
     * 提交产品
     * POST /api/products
     * - 返回可读错误信息（422 时带具体字段错误）
     */
    public function store(Request $request)
    {
        $user = $request->user();

        try {
            $data = $request->validate(
                [
                    'image'             => 'required|image|max:4096',
                    'reference_link_1'  => 'required|url',
                    'reference_link_2'  => 'nullable|url',
                    'reference_link_3'  => 'nullable|url',
                    'reason'            => 'required|string',
                    'differentiation'   => 'required|string',
                ],
                [
                    'image.required'            => '请上传产品图片',
                    'image.image'               => '图片格式不正确',
                    'image.max'                 => '图片大小不能超过 4MB',
                    'reference_link_1.required' => '参考链接 1 为必填',
                    'reference_link_1.url'      => '参考链接 1 格式不正确',
                    'reference_link_2.url'      => '参考链接 2 格式不正确',
                    'reference_link_3.url'      => '参考链接 3 格式不正确',
                    'reason.required'           => '请填写开发理由',
                    'differentiation.required'  => '请填写差异化说明',
                ]
            );

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

            return response()->json([
                'message' => '产品提交成功',
                'product' => $this->transformProduct($product->fresh('user')),
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => '提交失败，请检查表单内容',
                'errors'  => $e->errors(),
            ], 422);
        } catch (\Throwable $e) {
            Log::error('Create product failed', [
                'error'   => $e->getMessage(),
                'user_id' => $user->id,
            ]);

            return response()->json([
                'message' => '服务器内部错误，请稍后重试',
            ], 500);
        }
    }

    /**
     * 产品详情
     * GET /api/products/{product}
     * - 审核记录里点“产品 ID / 产品”会用到
     */
    public function show($id)
{
    $product = Product::with([
        'user:id,name,email',
        'reviews.reviewer:id,name',
    ])->find($id);

    if (!$product) {
        return response()->json(['message' => 'Product not found'], 404);
    }

    // 格式化返回
    return response()->json([
        'id'            => $product->id,
        'name'          => $product->name,
        'sku'           => $product->sku,
        'image_url'     => $product->image_url,
        'reference_url' => [
            'amazon'   => $product->reference_amazon,
            'alibaba'  => $product->reference_alibaba,
            'other'    => $product->reference_other,
        ],
        'status'        => $product->status,
        'created_at'    => $product->created_at->timezone('Asia/Shanghai')->format('Y-m-d H:i:s'),
        'submitted_by'  => $product->user ? $product->user->name : null,

        // 所有审核记录
        'reviews'       => $product->reviews->map(function ($r) {
            return [
                'id'         => $r->id,
                'status'     => $r->status,
                'comment'    => $r->comment,
                'reviewer'   => $r->reviewer ? $r->reviewer->name : null,
                'created_at' => $r->created_at->timezone('Asia/Shanghai')->format('Y-m-d H:i:s'),
            ];
        })
    ]);
}

    /**
     * 编辑产品
     * PUT /api/products/{product}
     * 规则：
     *  - 只有 管理员 或 产品所属操作员 可以编辑
     *  - 仅 pending / rejected 可以编辑，approved 不允许再改
     */
    public function update(Request $request, Product $product)
    {
        $user = $request->user();

        // 权限：只能管理员或产品所属操作员
        if ($user->role !== 'admin' && $product->user_id !== $user->id) {
            return response()->json(['message' => '无权限编辑该产品'], 403);
        }

        // 审核通过后禁止编辑
        if ($product->review_result === 'approved') {
            return response()->json(['message' => '已通过审核的产品不能再编辑'], 422);
        }

        try {
            $data = $request->validate(
                [
                    'image'             => 'nullable|image|max:4096',
                    'reference_link_1'  => 'required|url',
                    'reference_link_2'  => 'nullable|url',
                    'reference_link_3'  => 'nullable|url',
                    'reason'            => 'required|string',
                    'differentiation'   => 'required|string',
                ],
                [
                    'image.image'               => '图片格式不正确',
                    'image.max'                 => '图片大小不能超过 4MB',
                    'reference_link_1.required' => '参考链接 1 为必填',
                    'reference_link_1.url'      => '参考链接 1 格式不正确',
                    'reference_link_2.url'      => '参考链接 2 格式不正确',
                    'reference_link_3.url'      => '参考链接 3 格式不正确',
                    'reason.required'           => '请填写开发理由',
                    'differentiation.required'  => '请填写差异化说明',
                ]
            );

            // 如果上传了新图片，替换旧图片
            if ($request->hasFile('image')) {
                if ($product->image_path) {
                    Storage::disk('public')->delete($product->image_path);
                }

                $product->image_path = $request->file('image')->store('products', 'public');
            }

            $product->reference_link_1 = $data['reference_link_1'];
            $product->reference_link_2 = $data['reference_link_2'] ?? null;
            $product->reference_link_3 = $data['reference_link_3'] ?? null;
            $product->reason           = $data['reason'];
            $product->differentiation  = $data['differentiation'];

            // 编辑后重新回到待审核（你之前的需求：pending / rejected 可编辑）
            // 你也可以改成：只在 rejected 时重置；这里统一成 pending
            $product->review_result = 'pending';

            $product->save();

            return response()->json([
                'message' => '产品已更新',
                'product' => $this->transformProduct($product->fresh('user')),
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => '更新失败，请检查表单内容',
                'errors'  => $e->errors(),
            ], 422);
        } catch (\Throwable $e) {
            Log::error('Update product failed', [
                'product_id' => $product->id,
                'error'      => $e->getMessage(),
            ]);

            return response()->json([
                'message' => '服务器内部错误，请稍后重试',
            ], 500);
        }
    }

    /**
     * 审核产品（审核员 / 管理员）
     * PUT /api/products/{product}/review
     */
    public function updateReview(Request $request, Product $product)
    {
        $user = $request->user();

        $data = $request->validate([
            'result'  => 'required|in:pending,approved,rejected',
            'comment' => 'nullable|string',
        ], [
            'result.required' => '请选择审核结果',
            'result.in'       => '审核结果不合法',
        ]);

        // 更新产品审核状态
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

    /**
     * 内部：统一产品返回结构
     */
    protected function transformProduct(Product $product): array
    {
        $product->loadMissing('user');

        return [
            'id'                => $product->id,
            'user_id'           => $product->user_id,
            'user_name'         => optional($product->user)->name,
            'image_path'        => $product->image_path,
            'image_url'         => $product->image_path
                ? Storage::url($product->image_path)
                : null,
            'reference_link_1'  => $product->reference_link_1,
            'reference_link_2'  => $product->reference_link_2,
            'reference_link_3'  => $product->reference_link_3,
            'reason'            => $product->reason,
            'differentiation'   => $product->differentiation,
            'review_result'     => $product->review_result,
            'created_at'        => optional($product->created_at)->toDateTimeString(),
            'updated_at'        => optional($product->updated_at)->toDateTimeString(),
        ];
    }
}
