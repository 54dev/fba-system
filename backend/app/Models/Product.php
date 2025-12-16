<?php
// app/Models/Product.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

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
     * 所有审核记录（历史）
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(ProductReview::class);
    }

    /**
     * 当前审核结果（Controller 正在用的关系）
     * 语义：最新一条审核记录
     */
    public function review(): HasOne
    {
        return $this->hasOne(ProductReview::class)->latestOfMany();
    }

    /**
     * 计算属性：完整图片 URL
     */
    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image_path) {
            return null;
        }

        return url('/storage/' . ltrim($this->image_path, '/'));
    }
}
