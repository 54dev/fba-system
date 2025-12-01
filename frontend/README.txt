FBA 前端（React + Vite + Docker）

使用方式：
1. 将本目录解压后，覆盖你项目中的 frontend 目录：
   - 原 fba-system/frontend 删除或备份
   - 把 zip 解压得到的所有文件放到 fba-system/frontend

2. 确认 docker-compose.yml 中 frontend 服务类似：
   frontend:
     build:
       context: ./frontend
     container_name: fba_frontend
     restart: unless-stopped
     ports:
       - "3000:3000"
     volumes:
       - ./frontend:/usr/src/app
     depends_on:
       - backend

3. 在项目根目录执行：
   docker-compose stop frontend
   docker-compose rm -f frontend
   docker-compose up -d --build frontend

4. 前端启动后访问：
   http://localhost:3000

5. 登录账号使用后端创建的用户，例如：
   admin@example.com / password
