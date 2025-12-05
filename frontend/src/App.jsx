import React from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { Layout, Menu } from "antd";
import {
  AppstoreOutlined,
  UserOutlined,
  LogoutOutlined,
  FileAddOutlined,
  UnorderedListOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProductList from "./pages/ProductList";
import ProductCreate from "./pages/ProductCreate";
import ReviewList from "./pages/ReviewList";
import LoginLog from "./pages/LoginLog";
import UserPage from "./pages/UserPage";

import { logout } from "./api";

const { Header, Sider, Content } = Layout;

function AppLayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["dashboard"]}>
          <Menu.Item key="dashboard" icon={<AppstoreOutlined />}>
            <Link to="/dashboard">主页</Link>
          </Menu.Item>

          <Menu.Item key="products" icon={<UnorderedListOutlined />}>
            <Link to="/products">产品列表</Link>
          </Menu.Item>

          <Menu.Item key="create" icon={<FileAddOutlined />}>
            <Link to="/products/create">添加产品</Link>
          </Menu.Item>

          <Menu.Item key="reviews" icon={<CheckCircleOutlined />}>
            <Link to="/reviews">审核记录</Link>
          </Menu.Item>

          <Menu.Item key="loginLogs" icon={<ClockCircleOutlined />}>
            <Link to="/login-logs">登录日志</Link>
          </Menu.Item>

          <Menu.Item key="users" icon={<UserOutlined />}>
            <Link to="/users">用户管理</Link>
          </Menu.Item>

          <Menu.Item
            key="logout"
            icon={<LogoutOutlined />}
            style={{ marginTop: "40px" }}
            onClick={handleLogout}
          >
            退出登录
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Content style={{ padding: "20px" }}>{children}</Content>
      </Layout>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          }
        />

        <Route
          path="/products"
          element={
            <AppLayout>
              <ProductList />
            </AppLayout>
          }
        />

        <Route
          path="/products/create"
          element={
            <AppLayout>
              <ProductCreate />
            </AppLayout>
          }
        />

        <Route
          path="/reviews"
          element={
            <AppLayout>
              <ReviewList />
            </AppLayout>
          }
        />

        <Route
          path="/login-logs"
          element={
            <AppLayout>
              <LoginLog />
            </AppLayout>
          }
        />

        <Route
          path="/users"
          element={
            <AppLayout>
              <UserPage />
            </AppLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
