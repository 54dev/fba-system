import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Form, Input, Select, Button, message } from "antd";
import { fetchUserDetail, updateUser } from "../api";

export default function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const data = await fetchUserDetail(id);
      form.setFieldsValue({
        name: data.name,
        email: data.email,
        role: data.role,
      });
    } catch (err) {
      console.error(err);
      message.error("加载用户信息失败");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      await updateUser(id, values);
      message.success("用户信息已更新");
      navigate("/users");
    } catch (err) {
      console.error(err);
      message.error("保存失败，请检查输入");
    }
  };

  return (
    <Card title="编辑用户">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="姓名" name="name" rules={[{ required: true }]}>
          <Input placeholder="请输入姓名" />
        </Form.Item>

        <Form.Item
          label="邮箱"
          name="email"
          rules={[{ required: true, type: "email" }]}
        >
          <Input placeholder="请输入邮箱" />
        </Form.Item>

        <Form.Item label="角色" name="role" rules={[{ required: true }]}>
          <Select>
            <Select.Option value="admin">管理员</Select.Option>
            <Select.Option value="reviewer">审核员</Select.Option>
            <Select.Option value="operator">操作员</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            保存
          </Button>

          <Button
            style={{ marginLeft: 10 }}
            onClick={() => navigate("/users")}
          >
            取消
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
