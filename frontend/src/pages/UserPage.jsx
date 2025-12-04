import React, { useEffect, useState } from "react";
import { Table, Button, Form, Input, Select, Modal, message } from "antd";
import { fetchUsers, createUser } from "../api";

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);

  const loadUsers = () => {
    fetchUsers()
      .then(setUsers)
      .catch(() => message.error("加载失败"));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const onFinish = async (values) => {
    try {
      await createUser(values);
      message.success("用户创建成功");
      setOpen(false);
      loadUsers();
    } catch {
      message.error("创建失败");
    }
  };

  const columns = [
    { title: "姓名", dataIndex: "name" },
    { title: "邮箱", dataIndex: "email" },
    { title: "角色", dataIndex: "role" },
  ];

  return (
    <div>
      <h2>用户管理</h2>

      <Button type="primary" onClick={() => setOpen(true)} style={{ marginBottom: 20 }}>
        创建用户
      </Button>

      <Table rowKey="id" dataSource={users} columns={columns} />

      <Modal open={open} title="创建用户" onCancel={() => setOpen(false)} footer={null}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="email" label="邮箱" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="password" label="密码" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item name="role" label="角色" rules={[{ required: true }]}>
            <Select
              options={[
                { value: "admin", label: "管理员" },
                { value: "reviewer", label: "审核员" },
                { value: "operator", label: "操作员" },
              ]}
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            提交
          </Button>
        </Form>
      </Modal>
    </div>
  );
}
