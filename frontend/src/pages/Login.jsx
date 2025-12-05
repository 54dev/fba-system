import React, { useState } from "react";
import { login } from "../api";
import { useNavigate } from "react-router-dom";
import { Card, Form, Input, Button, message } from "antd";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const res = await login(values.email, values.password);

      // 保存 token
      localStorage.setItem("token", res.token);

      message.success("登录成功");

      // 强制跳转到 dashboard
      navigate("/dashboard", { replace: true });

    } catch (err) {
      console.error(err);
      message.error("账号或密码错误");
    }
    setLoading(false);
  };

  return (
    <div style={{ display:"flex", height:"100vh", justifyContent:"center", alignItems:"center" }}>
      <Card title="后台登录" style={{ width: 360 }}>
        <Form onFinish={handleSubmit}>
          <Form.Item name="email" rules={[{ required: true, message: "请输入邮箱" }]}>
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: "请输入密码" }]}>
            <Input.Password placeholder="密码" />
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