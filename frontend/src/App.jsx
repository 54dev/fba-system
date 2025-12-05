import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProductList from "./pages/ProductList";
import ProductCreate from "./pages/ProductCreate";
import ReviewList from "./pages/ReviewList";
import LoginLog from "./pages/LoginLog";
import UserPage from "./pages/UserPage";

import RequireAuth from "./components/RequireAuth";
import Layout from "./components/Layout"; // 你的菜单布局组件

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 登录页面 */}
        <Route path="/" element={<Login />} />

        {/* 下面所有页面必须登录 */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Layout><Dashboard /></Layout>
            </RequireAuth>
          }
        />

        <Route
          path="/products"
          element={
            <RequireAuth>
              <Layout><ProductList /></Layout>
            </RequireAuth>
          }
        />

        <Route
          path="/products/create"
          element={
            <RequireAuth>
              <Layout><ProductCreate /></Layout>
            </RequireAuth>
          }
        />

        <Route
          path="/reviews"
          element={
            <RequireAuth>
              <Layout><ReviewList /></Layout>
            </RequireAuth>
          }
        />

        <Route
          path="/login-logs"
          element={
            <RequireAuth>
              <Layout><LoginLog /></Layout>
            </RequireAuth>
          }
        />

        <Route
          path="/users"
          element={
            <RequireAuth>
              <Layout><UserPage /></Layout>
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
