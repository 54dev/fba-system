import React, { useEffect, useState } from "react";
import { Card, Form, Input, Select, Button, message } from "antd";
import { fetchUserDetail, updateUser } from "../api";
import { useNavigate, useParams } from "react-router-dom";

export default function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDetail(id)
      .then((res) => {
        form.setFieldsValue({
          name: res.name,
          email: res.email,
          role: res.role
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  const onSubmit = async (values) => {
    try {
      await updateUser(id, values);
      message.success("用户更新成功");
      navigate(`/users/${id}`);
    } catch (err) {
      message.error(err.message);
    }
  };

  return (
    <Card title="编辑用户" loading={loading}>
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item name="name" label="用户名" rules={[{ required: true }]}>
          <Input placeholder="请输入用户名" />
        </Form.Item>

        <Form.Item name="email" label="邮箱" rules={[{ required: true }]}>
          <Input placeholder="请输入邮箱" />
        </Form.Item>

        <Form.Item name="role" label="角色" rules={[{ required: true }]}>
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
          <Button style={{ marginLeft: 10 }} onClick={() => navigate(-1)}>
            返回
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}