// frontend/src/pages/UserPage.jsx
import React, { useEffect, useState } from "react";
import { Table, Tag, Button, Form, Input, Select, Space, message, Card } from "antd";
import { Link } from "react-router-dom";
import { fetchUsers, createUser } from "../api";

const { Option } = Select;

const ROLE_LABEL = {
  admin: "管理员",
  reviewer: "审核员",
  operator: "操作员",
};

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetchUsers();

      // ✅ 防御式处理，确保一定是数组
      const list =
        Array.isArray(res) ? res :
        Array.isArray(res?.data) ? res.data :
        Array.isArray(res?.users) ? res.users :
        [];

      setUsers(list);
    } catch (e) {
      console.error("加载用户失败:", e);
      message.error("加载用户列表失败");
      // ❗ 这里绝对不动 token，不做登出操作
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async (values) => {
    try {
      setSaving(true);
      await createUser(values);
      message.success("创建用户成功");
      form.resetFields();
      loadUsers();
    } catch (e) {
      console.error("创建用户失败:", e);
      const msg =
        e?.message ||
        e?.response?.data?.message ||
        "创建用户失败，请稍后重试";
      message.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 80,
      render: (id) => <Link to={`/users/${id}`}>{id}</Link>,
    },
    {
      title: "姓名",
      dataIndex: "name",
      width: 160,
    },
    {
      title: "邮箱",
      dataIndex: "email",
      width: 220,
    },
    {
      title: "角色",
      dataIndex: "role",
      width: 120,
      render: (role) => {
        let color = "default";
        if (role === "admin") color = "red";
        else if (role === "reviewer") color = "blue";
        else if (role === "operator") color = "green";

        return <Tag color={color}>{ROLE_LABEL[role] || role}</Tag>;
      },
    },
    {
      title: "操作",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Space>
          <Link to={`/users/${record.id}`}>详情</Link>
          <Link to={`/users/${record.id}/edit`}>编辑</Link>
        </Space>
      ),
    },
  ];

  const dataSource = Array.isArray(users) ? users : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* 创建用户表单 */}
      <Card title="创建新用户">
        <Form
          form={form}
          layout="inline"
          onFinish={handleCreate}
          style={{ rowGap: 12 }}
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: "请输入姓名" }]}
          >
            <Input placeholder="用户姓名" style={{ width: 180 }} />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: "请输入邮箱" },
              { type: "email", message: "邮箱格式不正确" },
            ]}
          >
            <Input placeholder="邮箱" style={{ width: 220 }} />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: "请输入初始密码" }]}
          >
            <Input.Password placeholder="初始密码" style={{ width: 180 }} />
          </Form.Item>

          <Form.Item
            name="role"
            label="角色"
            initialValue="operator"
            rules={[{ required: true, message: "请选择角色" }]}
          >
            <Select style={{ width: 140 }}>
              <Option value="admin">管理员</Option>
              <Option value="reviewer">审核员</Option>
              <Option value="operator">操作员</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={saving}>
              创建用户
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* 用户列表 */}
      <Card title="用户列表">
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
