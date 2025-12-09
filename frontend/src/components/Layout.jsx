// src/components/Layout.jsx
import React from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";

const { Sider, Content } = Layout;

export default function AppLayout({ user, children }) {
  const role = user?.role;

  const items = [];

  items.push({
    label: <Link to="/dashboard">主页</Link>,
    key: "dashboard",
  });

  items.push({
    label: <Link to="/products">产品列表</Link>,
    key: "products",
  });

  items.push({
    label: <Link to="/products/create">添加产品</Link>,
    key: "create",
  });

  if (["reviewer", "admin"].includes(role)) {
    items.push({
      label: <Link to="/reviews">审核记录</Link>,
      key: "reviews",
    });
  }

  if (role === "admin") {
    items.push({
      label: <Link to="/login-logs">登录日志</Link>,
      key: "loginlogs",
    });
    items.push({
      label: <Link to="/users">用户管理</Link>,
      key: "users",
    });
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={200}>
        <Menu mode="inline" items={items} />
      </Sider>

      <Layout>
        <Content style={{ padding: 20 }}>{children}</Content>
      </Layout>
    </Layout>
  );
}
