import React, { useState } from "react";
import { Card, Form, Input, Button, message } from "antd";
import { login } from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const res = await login(values.email, values.password);

      localStorage.setItem("token", res.token);
      message.success("登录成功！");
      navigate("/dashboard");
    } catch (err) {
      message.error("账号或密码错误");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "#f0f2f5"
    }}>
      <Card title="登录系统" style={{ width: 350 }}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" label="邮箱" rules={[{ required: true }]}>
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item name="password" label="密码" rules={[{ required: true }]}>
            <Input.Password placeholder="请输入密码" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading}>
            登录
          </Button>
        </Form>
      </Card>
    </div>
  );
}
