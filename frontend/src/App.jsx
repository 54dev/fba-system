import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProductList from "./pages/ProductList";
import ProductCreate from "./pages/ProductCreate";
import ReviewList from "./pages/ReviewList";
import LoginLog from "./pages/LoginLog";
import UserPage from "./pages/UserPage";

import AppLayout from "./components/Layout";
import { fetchMe } from "./api";


// ============================
// 🛡️ 最终版 ProtectedRoute
// ============================
function ProtectedRoute({ user, children }) {
  const token = localStorage.getItem("token");

  // 如果连 token 都没有 → 真的未登录
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // token 存在但 user 未加载 → 等待加载
  if (!user) {
    return <div style={{ padding: 20 }}>加载中...</div>;
  }

  return children;
}


// ============================
// 🏠 主应用程序
// ============================
export default function App() {
  const [user, setUser] = useState(null);
  const [loadingMe, setLoadingMe] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoadingMe(false);
      return;
    }

    fetchMe()
      .then((res) => setUser(res.user))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoadingMe(false));
  }, []);

  // 避免初始闪白
  if (loadingMe) {
    return <div style={{ padding: 20 }}>初始化中...</div>;
  }


  return (
    <BrowserRouter>
      <Routes>

        {/* 登录页面 */}
        <Route path="/" element={<Login onLogin={setUser} />} />


        {/* ============================
            受保护的业务页面
        ============================ */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <AppLayout user={user}>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute user={user}>
              <AppLayout user={user}>
                <ProductList user={user} />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/products/create"
          element={
            <ProtectedRoute user={user}>
              <AppLayout user={user}>
                <ProductCreate />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reviews"
          element={
            <ProtectedRoute user={user}>
              <AppLayout user={user}>
                <ReviewList />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/login-logs"
          element={
            <ProtectedRoute user={user}>
              <AppLayout user={user}>
                <LoginLog />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute user={user}>
              <AppLayout user={user}>
                <UserPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}