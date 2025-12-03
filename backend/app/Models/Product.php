<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'operator_id',
        'image_path',
        'ref_link1',
        'ref_link2',
        'ref_link3',
        'reason',
        'differentiation',
        'review_status',
    ];

    public function operator()
    {
        return $this->belongsTo(User::class, 'operator_id');
    }

    public function reviews()
    {
        
    }
}
