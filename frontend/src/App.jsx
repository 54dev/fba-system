// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Spin } from "antd";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProductList from "./pages/ProductList";
import ProductCreate from "./pages/ProductCreate";
import ProductDetail from "./pages/ProductDetail";
import ReviewList from "./pages/ReviewList";
import LoginLog from "./pages/LoginLog";
import UserPage from "./pages/UserPage";
import UserDetail from "./pages/UserDetail";

import AppLayout from "./components/Layout";
import { fetchMe, logout as apiLogout } from "./api";

function ProtectedRoute({ user, loading, children }) {
  if (loading) {
    return (
      <div style={{ paddingTop: 100, textAlign: "center" }}>
        <Spin tip="加载中..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // 首次加载，根据 token 拉取当前用户
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoadingUser(false);
      return;
    }

    fetchMe()
      .then((res) => {
        setUser(res.user);
      })
      .catch(() => {
        localStorage.removeItem("token");
      })
      .finally(() => setLoadingUser(false));
  }, []);

  // Login.jsx 登录成功后会调用
  const handleLogin = (userFromLogin) => {
    setUser(userFromLogin);
  };

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch (e) {
      // 后端报错也无所谓，本地仍然清理
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      window.location.href = "/";
    }
  };

  const withLayout = (element) => (
    <ProtectedRoute user={user} loading={loadingUser}>
      <AppLayout user={user} onLogout={handleLogout}>
        {element}
      </AppLayout>
    </ProtectedRoute>
  );

  return (
    <BrowserRouter>
      <Routes>
        {/* 登录页（不需要 Layout） */}
        <Route path="/" element={<Login onLogin={handleLogin} />} />

        {/* 主页 */}
        <Route path="/dashboard" element={withLayout(<Dashboard />)} />

        {/* 产品列表 */}
        <Route
          path="/products"
          element={withLayout(<ProductList user={user} />)}
        />

        {/* 添加产品 */}
        <Route
          path="/products/create"
          element={withLayout(<ProductCreate />)}
        />

        {/* 产品详情 */}
        <Route
          path="/products/:id"
          element={withLayout(<ProductDetail />)}
        />

        {/* 审核记录 */}
        <Route path="/reviews" element={withLayout(<ReviewList />)} />

        {/* 登录日志（仅 admin 在菜单里可进） */}
        <Route path="/login-logs" element={withLayout(<LoginLog />)} />

        {/* 用户管理 */}
        <Route path="/users" element={withLayout(<UserPage />)} />

        {/* 用户详情 */}
        <Route path="/users/:id" element={withLayout(<UserDetail />)} />

        {/* 兜底：未知路由重定向到登录 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
