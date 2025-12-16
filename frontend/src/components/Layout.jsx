// frontend/src/components/Layout.jsx
import React from "react";
import { Layout, Menu, Typography, Button } from "antd";
import {
  DashboardOutlined,
  ShoppingOutlined,
  PlusOutlined,
  FileSearchOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const AppLayout = ({ user, onLogout, children }) => {
  const location = useLocation();
  const role = user?.role;

  const items = [];

  // 主页：所有角色都有
  items.push({
    key: "/dashboard",
    icon: <DashboardOutlined />,
    label: <Link to="/dashboard">主页</Link>,
  });

  // 产品列表：所有角色
  items.push({
    key: "/products",
    icon: <ShoppingOutlined />,
    label: <Link to="/products">产品列表</Link>,
  });

  // 添加产品：操作员 + 管理员
  if (role === "operator" || role === "admin") {
    items.push({
      key: "/products/create",
      icon: <PlusOutlined />,
      label: <Link to="/products/create">添加产品</Link>,
    });
  }

  // 审核记录：审核员 + 管理员
  if (role === "reviewer" || role === "admin") {
    items.push({
      key: "/reviews",
      icon: <FileSearchOutlined />,
      label: <Link to="/reviews">审核记录</Link>,
    });
  }

  // 登录日志：只有管理员
  if (role === "admin") {
    items.push({
      key: "/login-logs",
      icon: <ClockCircleOutlined />,
      label: <Link to="/login-logs">登录日志</Link>,
    });
  }

  // 用户管理：只有管理员
  if (role === "admin") {
    items.push({
      key: "/users",
      icon: <TeamOutlined />,
      label: <Link to="/users">用户管理</Link>,
    });
  }

  // 匹配当前选中的菜单
  const selectedKey =
    items.find((item) => location.pathname.startsWith(item.key))?.key ||
    "/dashboard";

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider theme="dark">
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          FBA 管理后台
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[selectedKey]} items={items} />
      </Sider>
      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <Title level={4} style={{ margin: 0 }}>
              欢迎，{user?.name || "用户"}
            </Title>
            <Text type="secondary">角色：{user?.role || "未知"}</Text>
          </div>
          <Button icon={<LogoutOutlined />} danger onClick={onLogout}>
            退出登录
          </Button>
        </Header>
        <Content style={{ padding: 24, background: "#f5f5f5" }}>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
