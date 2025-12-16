import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import * as api from "./api"; // ✅ 必须使用 * as api

import AppLayout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProductList from "./pages/ProductList";
import ProductCreate from "./pages/ProductCreate";
import ProductDetail from "./pages/ProductDetail";
import ReviewList from "./pages/ReviewList";
import LoginLog from "./pages/LoginLog";
import UserPage from "./pages/UserPage";
import UserDetail from "./pages/UserDetail";
import UserEdit from "./pages/UserEdit";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .me()
      .then((res) => {
        setUser(res.user);
      })
      .catch(() => {
        localStorage.removeItem("token");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return null;

  return (
    <BrowserRouter>
      <Routes>
        {/* 登录页 */}
        <Route path="/" element={<Login onLogin={setUser} />} />

        {/* 仪表盘 */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth user={user}>
              <AppLayout user={user}>
                <Dashboard user={user} />
              </AppLayout>
            </RequireAuth>
          }
        />

        {/* 产品列表 */}
        <Route
          path="/products"
          element={
            <RequireAuth user={user}>
              <AppLayout user={user}>
                <ProductList user={user} />
              </AppLayout>
            </RequireAuth>
          }
        />

        {/* 新建产品 */}
        <Route
          path="/products/create"
          element={
            <RequireAuth user={user}>
              <AppLayout user={user}>
                <ProductCreate user={user} />
              </AppLayout>
            </RequireAuth>
          }
        />

        {/* 产品详情 */}
        <Route
          path="/products/:id"
          element={
            <RequireAuth user={user}>
              <AppLayout user={user}>
                <ProductDetail user={user} />
              </AppLayout>
            </RequireAuth>
          }
        />

        {/* 审核记录 */}
        <Route
          path="/reviews"
          element={
            <RequireAuth user={user}>
              <AppLayout user={user}>
                <ReviewList user={user} />
              </AppLayout>
            </RequireAuth>
          }
        />

        {/* 登录日志 */}
        <Route
          path="/login-logs"
          element={
            <RequireAuth user={user}>
              <AppLayout user={user}>
                <LoginLog />
              </AppLayout>
            </RequireAuth>
          }
        />

        {/* 用户管理 */}
        <Route
          path="/users"
          element={
            <RequireAuth user={user}>
              <AppLayout user={user}>
                <UserPage />
              </AppLayout>
            </RequireAuth>
          }
        />

        {/* 用户详情 */}
        <Route
          path="/users/:id"
          element={
            <RequireAuth user={user}>
              <AppLayout user={user}>
                <UserDetail />
              </AppLayout>
            </RequireAuth>
          }
        />

        {/* 用户编辑 */}
        <Route
          path="/users/:id/edit"
          element={
            <RequireAuth user={user}>
              <AppLayout user={user}>
                <UserEdit />
              </AppLayout>
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
