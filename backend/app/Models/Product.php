<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'image_path',
        'reference_link_1',
        'reference_link_2',
        'reference_link_3',
        'reason',
        'differentiation',
        'review_result',
    ];

    // 让 image_url 自动出现在 JSON 里
    protected $appends = ['image_url'];

    /**
     * 提交人（操作员）
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * 审核记录
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(ProductReview::class);
    }

    /**
     * 计算属性：完整图片 URL
     * 前端直接用 product.image_url 即可
     */
    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image_path) {
            return null;
        }

        // 生成类似 http://localhost/storage/products/xxx.jpg
        return url('/storage/' . ltrim($this->image_path, '/'));
    }
}
