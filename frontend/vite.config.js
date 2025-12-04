import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 3000,

    // 🔥 核心：把 /api 请求代理到 nginx，让后端 Laravel 处理
    proxy: {
      "/api": {
        target: "http://nginx", 
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
