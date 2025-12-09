import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProductList from "./pages/ProductList";
import ProductCreate from "./pages/ProductCreate";
import ReviewList from "./pages/ReviewList";
import LoginLog from "./pages/LoginLog";
import UserPage from "./pages/UserPage";
import UserDetail from "./pages/UserDetail";
import UserEdit from "./pages/UserEdit";
import ProductDetail from "./pages/ProductDetail";

import AppLayout from "./components/Layout";
import { fetchMe } from "./api";

function ProtectedRoute({ user, loading, children }) {
  if (loading) {
    return <div style={{ padding: 40 }}>加载中...</div>;
  }
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // 👈 新增

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuthLoading(false);
      return;
    }

    fetchMe()
      .then((res) => {
        setUser(res.user);
      })
      .catch(() => {
        localStorage.removeItem("token");
      })
      .finally(() => {
        setAuthLoading(false); // 👈 必须：等 fetchMe 结束后才允许页面渲染
      });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login onLogin={setUser} />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user} loading={authLoading}>
              <AppLayout user={user}>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* 产品相关 */}
        <Route
          path="/products"
          element={
            <ProtectedRoute user={user} loading={authLoading}>
              <AppLayout user={user}>
                <ProductList user={user} />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/products/create"
          element={
            <ProtectedRoute user={user} loading={authLoading}>
              <AppLayout user={user}>
                <ProductCreate />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/products/:id"
          element={
            <ProtectedRoute user={user} loading={authLoading}>
              <AppLayout user={user}>
                <ProductDetail />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* 审核记录 */}
        <Route
          path="/reviews"
          element={
            <ProtectedRoute user={user} loading={authLoading}>
              <AppLayout user={user}>
                <ReviewList />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* 登录日志（管理员） */}
        <Route
          path="/login-logs"
          element={
            <ProtectedRoute user={user} loading={authLoading}>
              <AppLayout user={user}>
                <LoginLog />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* 用户管理 */}
        <Route
          path="/users"
          element={
            <ProtectedRoute user={user} loading={authLoading}>
              <AppLayout user={user}>
                <UserPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/users/:id"
          element={
            <ProtectedRoute user={user} loading={authLoading}>
              <AppLayout user={user}>
                <UserDetail />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/users/:id/edit"
          element={
            <ProtectedRoute user={user} loading={authLoading}>
              <AppLayout user={user}>
                <UserEdit />
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}