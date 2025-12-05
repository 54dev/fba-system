import React, { useState } from "react";
import { Card, Form, Input, Button, Typography, message } from "antd";
import { login as loginApi } from "../api";

const { Title } = Typography;

export default function Login({ onLogin }) {
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      const res = await loginApi(values.email, values.password);
      if (!res || !res.token || !res.user) {
        throw new Error("登录响应格式不正确");
      }
      message.success("登录成功");
      onLogin(res.user, res.token);
    } catch (err) {
      console.error(err);
      message.error("登录失败，请检查账号或密码");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f0f2f5",
      }}
    >
      <Card style={{ width: 360, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
        <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
          FBA 系统登录
        </Title>

        <Form
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ email: "admin@example.com", password: "password" }}
        >
          <Form.Item
            label="邮箱"
            name="email"
            rules={[{ required: true, message: "请输入邮箱" }]}
          >
            <Input placeholder="admin@example.com" />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}