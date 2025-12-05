import React, { useEffect, useState, useCallback } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Spin } from "antd";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProductList from "./pages/ProductList";
import ProductCreate from "./pages/ProductCreate";
import ReviewList from "./pages/ReviewList";
import LoginLog from "./pages/LoginLog";
import UserPage from "./pages/UserPage";

import AppLayout from "./components/Layout";
import { fetchMe, logout as apiLogout } from "./api";

// 受保护路由：没有 user 就跳回登录
function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false); // 是否完成“自动登录检查”
  const navigate = useNavigate();

  // 首次加载：如果本地有 token 就去 /api/me 校验一次
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuthChecked(true);
      return;
    }

    fetchMe()
      .then((res) => {
        // 后端一般返回 { user: {...} }，保险起见两种都兼容
        setUser(res.user || res);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => {
        setAuthChecked(true);
      });
  }, []);

  // 登录成功后调用：保存 token + user，并跳转到 dashboard
  const handleLogin = useCallback(
    (userData, token) => {
      if (token) {
        localStorage.setItem("token", token);
      }
      setUser(userData);
      navigate("/dashboard", { replace: true });
    },
    [navigate]
  );

  // 退出登录：即使后端 500，也会强制清理前端状态
  const handleLogout = useCallback(async () => {
    try {
      await apiLogout();
    } catch (e) {
      console.error("logout error", e);
      // 后端出错也没关系，前端照样清理
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      navigate("/", { replace: true });
    }
  }, [navigate]);

  // 全局“加载中”：只在第一次自动校验登录状态时显示
  if (!authChecked) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f5f5",
        }}
      >
        <Spin tip="加载中..." />
      </div>
    );
  }

  return (
    <Routes>
      {/* 登录页：
          - 未登录：显示登录表单
          - 已登录：直接跳到 dashboard
       */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login onLogin={handleLogin} />
          )
        }
      />

      {/* 以下全部是“受保护页面”，没有登录访问会直接被 ProtectedRoute 拦截 */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute user={user}>
            <AppLayout user={user} onLogout={handleLogout}>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/products"
        element={
          <ProtectedRoute user={user}>
            <AppLayout user={user} onLogout={handleLogout}>
              <ProductList user={user} />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/products/create"
        element={
          <ProtectedRoute user={user}>
            <AppLayout user={user} onLogout={handleLogout}>
              <ProductCreate />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reviews"
        element={
          <ProtectedRoute user={user}>
            <AppLayout user={user} onLogout={handleLogout}>
              <ReviewList />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/login-logs"
        element={
          <ProtectedRoute user={user}>
            <AppLayout user={user} onLogout={handleLogout}>
              <LoginLog />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/users"
        element={
          <ProtectedRoute user={user}>
            <AppLayout user={user} onLogout={handleLogout}>
              <UserPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* 兜底：乱输路由的时候 */}
      <Route
        path="*"
        element={
          user ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />
        }
      />
    </Routes>
  );
}