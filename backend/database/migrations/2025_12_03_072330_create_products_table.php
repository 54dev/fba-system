<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();

            // 操作员（提交人）
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // 日期：用 Laravel 自带的 created_at 即可
            // 图片：存相对路径，如 storage/products/xxxx.jpg
            $table->string('image_path');

            // 参考链接 1~3
            $table->string('reference_link_1');
            $table->string('reference_link_2')->nullable();
            $table->string('reference_link_3')->nullable();

            // 开发理由
            $table->text('reason');

            // 差异化（包含定价、配置等）
            $table->text('differentiation');

            // 审核结果（比如 pending/approved/rejected，也可以直接存“通过/不通过”）
            $table->string('review_result')->default('pending');

            $table->timestamps(); // created_at 就是你要的“日期”，updated_at 保留以后也方便
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
