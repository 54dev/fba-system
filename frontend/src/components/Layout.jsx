import React from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  UnorderedListOutlined,
  PlusCircleOutlined,
  FileSearchOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { Link } from "react-router-dom";

const { Sider, Header, Content } = Layout;

export default function AppLayout({ children }) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider theme="dark" collapsible>
        <div style={{
          height: 50,
          margin: 16,
          color: "#fff",
          fontSize: 18,
          textAlign: "center",
          fontWeight: "bold"
        }}>
          FBA System
        </div>

        <Menu theme="dark" mode="inline">
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            <Link to="/dashboard">主页</Link>
          </Menu.Item>

          <Menu.Item key="2" icon={<UnorderedListOutlined />}>
            <Link to="/products">产品列表</Link>
          </Menu.Item>

          <Menu.Item key="3" icon={<PlusCircleOutlined />}>
            <Link to="/products/create">添加产品</Link>
          </Menu.Item>

          <Menu.Item key="4" icon={<FileSearchOutlined />}>
            <Link to="/reviews">审核记录</Link>
          </Menu.Item>

          <Menu.Item key="5" icon={<ClockCircleOutlined />}>
            <Link to="/login-logs">登录日志</Link>
          </Menu.Item>

          <Menu.Item key="6" icon={<UserOutlined />}>
            <Link to="/users">用户管理</Link>
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#fff",
            paddingLeft: 20,
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          FBA 内部管理系统
        </Header>

        <Content style={{ margin: 20, background: "#fff", padding: 20 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
