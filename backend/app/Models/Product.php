<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

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

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reviews()
    {
        return $this->hasMany(ProductReview::class);
    }
}
