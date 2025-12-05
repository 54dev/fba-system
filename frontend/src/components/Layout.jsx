import React from "react";
import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { logout } from "../api";

const { Sider, Content } = Layout;

export default function AppLayout({ user, children }) {
  const navigate = useNavigate();

  const menuItems = [];

  // ★ 所有人都有
  menuItems.push({
    key: "dashboard",
    label: "主页",
    onClick: () => navigate("/dashboard"),
  });

  menuItems.push({
    key: "products",
    label: "产品列表",
    onClick: () => navigate("/products"),
  });

  menuItems.push({
    key: "products-create",
    label: "添加产品",
    onClick: () => navigate("/products/create"),
  });

  // ★ 审核员 + 管理员
  if (user.role === "reviewer" || user.role === "admin") {
    menuItems.push({
      key: "reviews",
      label: "审核记录",
      onClick: () => navigate("/reviews"),
    });
  }

  // ★ 只有管理员
  if (user.role === "admin") {
    menuItems.push({
      key: "login-logs",
      label: "登录日志",
      onClick: () => navigate("/login-logs"),
    });
    menuItems.push({
      key: "users",
      label: "用户管理",
      onClick: () => navigate("/users"),
    });
  }

  // ★ 退出登陆永远显示
  menuItems.push({
    key: "logout",
    label: "退出登录",
    onClick: async () => {
      try {
        await logout();
      } catch (e) {}

      localStorage.removeItem("token");
      navigate("/");
    },
  });

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider theme="light">
        <Menu mode="inline" items={menuItems} />
      </Sider>

      <Layout>
        <Content style={{ padding: 20 }}>{children}</Content>
      </Layout>
    </Layout>
  );
}