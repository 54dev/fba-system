import React from "react";
import { Layout as AntLayout, Menu } from "antd";
import {
  AppstoreOutlined,
  UnorderedListOutlined,
  PlusCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

const { Header, Sider, Content } = AntLayout;

export default function AppLayout({ user, onLogout, children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const role = user?.role;

  const items = [];

  // 所有角色都有
  items.push({
    key: "/dashboard",
    icon: <AppstoreOutlined />,
    label: "主页",
  });

  items.push(
    {
      key: "/products",
      icon: <UnorderedListOutlined />,
      label: "产品列表",
    },
    {
      key: "/products/create",
      icon: <PlusCircleOutlined />,
      label: "添加产品",
    }
  );

  // 审核记录：管理员 + 审核员
  if (role === "admin" || role === "reviewer") {
    items.push({
      key: "/reviews",
      icon: <CheckCircleOutlined />,
      label: "审核记录",
    });
  }

  // 登录日志 & 用户管理：只有管理员
  if (role === "admin") {
    items.push(
      {
        key: "/login-logs",
        icon: <ClockCircleOutlined />,
        label: "登录日志",
      },
      {
        key: "/users",
        icon: <TeamOutlined />,
        label: "用户管理",
      }
    );
  }

  // 退出登录：所有角色都有，放在菜单最后
  items.push({
    key: "__logout",
    icon: <LogoutOutlined />,
    label: "退出登录",
    danger: true,
  });

  const handleClick = (info) => {
    if (info.key === "__logout") {
      onLogout && onLogout();
    } else {
      navigate(info.key);
    }
  };

  const selectedKeys = items
    .map((i) => i.key)
    .filter(
      (key) =>
        key !== "__logout" &&
        location.pathname.startsWith(key) // 简单匹配当前路由
    );

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Sider theme="dark">
        <div
          style={{
            height: 48,
            margin: 16,
            color: "#fff",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
          }}
        >
          FBA System
        </div>
        <Menu
          theme="dark"
          mode="inline"
          items={items}
          selectedKeys={selectedKeys}
          onClick={handleClick}
        />
      </Sider>

      <AntLayout>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <span>
            当前用户：{user?.name}（{user?.role}）
          </span>
        </Header>

        <Content style={{ margin: 24 }}>
          <div
            style={{
              background: "#fff",
              padding: 24,
              minHeight: 360,
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            {children}
          </div>
        </Content>
      </AntLayout>
    </AntLayout>
  );
}