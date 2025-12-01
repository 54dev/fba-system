FBA 产品管理系统 - 最终可运行版本

安装步骤：
1. 安装 Docker 和 Docker Compose，确保可用。
2. 解压本项目到本地，例如 fba-system/。
3. 在项目根目录执行：
   chmod +x init-backend.sh
   ./init-backend.sh

   该脚本会自动：
   - 使用 Docker 中的 composer 创建 Laravel 12 到 ./backend
   - 拷贝业务代码 backend_custom → backend
   - 启动 mysql / backend / nginx / frontend 容器
   - 在容器内安装 Sanctum + 迁移数据库 + storage:link

4. 初始化完成后：
   - 前端开发服务： http://localhost:3000
   - Nginx 网关：    http://localhost/
   - API：          http://localhost/api

5. 创建初始管理员用户（在容器内执行）：
   docker exec -it fba_backend sh
   php artisan tinker
   use App\Models\User;
   User::create(['name' => 'Admin', 'email' => 'admin@example.com', 'password' => bcrypt('password'), 'role' => 'admin']);
