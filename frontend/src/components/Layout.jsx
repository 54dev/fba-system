// src/components/Layout.jsx

import React from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  UnorderedListOutlined,
  PlusOutlined,
  AuditOutlined,
  HistoryOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Header, Sider, Content } = Layout;

export default function AppLayout({ user, onLogout, children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const role = user?.role || "operator";

  const menuItems = [];

  // 所有人都有：Dashboard + 产品列表
  menuItems.push(
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "主页",
    },
    {
      key: "/products",
      icon: <UnorderedListOutlined />,
      label: "产品列表",
    }
  );

  // 操作员：可以添加产品
  if (role === "operator" || role === "admin") {
    menuItems.push({
      key: "/products/create",
      icon: <PlusOutlined />,
      label: "添加产品",
    });
  }

  // 审核员 + 管理员：审核记录
  if (role === "reviewer" || role === "admin") {
    menuItems.push({
      key: "/reviews",
      icon: <AuditOutlined />,
      label: "审核记录",
    });
  }

  // 管理员：登录日志 + 用户管理
  if (role === "admin") {
    menuItems.push(
      {
        key: "/login-logs",
        icon: <HistoryOutlined />,
        label: "登录日志",
      },
      {
        key: "/users",
        icon: <UserOutlined />,
        label: "用户管理",
      }
    );
  }

  // 最后加一个退出登录
  menuItems.push({
    key: "logout",
    icon: <LogoutOutlined />,
    label: "退出登录",
  });

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      onLogout?.();
      return;
    }
    navigate(key);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider theme="dark">
        <div
          style={{
            height: 48,
            margin: 16,
            color: "#fff",
            fontWeight: "bold",
            fontSize: 18,
            display: "flex",
            alignItems: "center",
          }}
        >
          FBA 管理系统
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={handleMenuClick}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <span style={{ marginRight: 12 }}>当前用户：</span>
          <strong>{user?.name}</strong>
          <span style={{ marginLeft: 8, color: "#999" }}>
            ({user?.role})
          </span>
        </Header>
        <Content style={{ margin: 24 }}>
          <div
            style={{
              background: "#fff",
              padding: 24,
              minHeight: 360,
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
