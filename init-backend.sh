#!/bin/bash
set -e

echo "=================================================="
echo "🔥 FBA System 一键初始化（Laravel 12 + Sanctum + Docker）"
echo "=================================================="

echo "==> 停止并清理现有容器和数据卷..."
docker-compose down -v || true

echo "==> 重置 backend 目录..."
rm -rf backend
mkdir backend
ls -al backend

echo "==> 使用 Docker 中的 composer 创建 Laravel 12 项目..."
docker run --rm \
  -v "$(pwd)/backend":/app \
  -w /app \
  composer:2 create-project laravel/laravel .

echo "==> 复制自定义业务代码 backend_custom → backend..."
cp -r backend_custom/app backend/app
cp -r backend_custom/database backend/database
cp backend_custom/routes/api.php backend/routes/api.php

if [ ! -f backend/.env ]; then
  cp backend_custom/.env.backend backend/.env
  echo "==> 已创建 backend/.env"
fi

echo "==> 构建并启动 Docker 容器..."
docker-compose up -d --build

echo "==> 在容器内安装 Sanctum + 迁移数据库 + storage:link ..."
docker exec -T fba_backend sh -lc "composer require laravel/sanctum && php artisan vendor:publish --provider='Laravel\\Sanctum\\SanctumServiceProvider' && php artisan migrate && php artisan storage:link"

echo "=================================================="
echo "✅ 初始化完成！"
echo "前端（开发）： http://localhost:3000"
echo "Nginx 网关：  http://localhost/"
echo "API：        http://localhost/api"
echo ""
echo "下一步：创建初始用户（在容器内执行）："
echo "  docker exec -it fba_backend sh"
echo "  php artisan tinker"
echo "  use App\\Models\\User;"
echo "  User::create(['name' => 'Admin', 'email' => 'admin@example.com', 'password' => bcrypt('password'), 'role' => 'admin']);"
echo "=================================================="
