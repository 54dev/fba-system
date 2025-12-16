// frontend/src/pages/UserPage.jsx
import React, { useEffect, useState } from "react";
import { Table, Button, Tag, Space, Modal, Form, Input, Select, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { fetchUsers, createUser, updateUser } from "../api";
import { formatDateTimeCn } from "../utils/time";

const UserPage = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const loadUsers = () => {
    setLoading(true);
    fetchUsers()
      .then((res) => setUsers(Array.isArray(res) ? res : []))
      .catch((e) => {
        console.error(e);
        message.error("加载用户列表失败");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openCreateModal = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const openEditModal = (record) => {
    setEditingUser(record);
    form.setFieldsValue({
      name: record.name,
      email: record.email,
      role: record.role,
    });
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        await updateUser(editingUser.id, values);
        message.success("用户修改成功");
      } else {
        await createUser(values);
        message.success("用户创建成功");
      }
      setModalVisible(false);
      loadUsers();
    } catch (e) {
      if (e.errorFields) return; // 表单校验错误
      console.error(e);
      const msg =
        e?.data?.errors
          ? Object.values(e.data.errors)
              .flat()
              .join("；")
          : e.message || "操作失败";
      message.error(msg);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id) => <Link to={`/users/${id}`}>{id}</Link>,
    },
    {
      title: "姓名",
      dataIndex: "name",
    },
    {
      title: "邮箱",
      dataIndex: "email",
    },
    {
      title: "角色",
      dataIndex: "role",
      render: (role) => {
        let color = "default";
        let text = role;
        if (role === "admin") {
          color = "red";
          text = "管理员";
        } else if (role === "reviewer") {
          color = "blue";
          text = "审核员";
        } else if (role === "operator") {
          color = "green";
          text = "操作员";
        }
        return <Tag color={color}>{text || "-"}</Tag>;
      },
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      render: (val) => formatDateTimeCn(val),
    },
    {
      title: "操作",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => navigate(`/users/${record.id}`)}>
            详情
          </Button>
          <Button type="link" onClick={() => openEditModal(record)}>
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={openCreateModal}>
          新建用户
        </Button>
      </Space>

      <Table
        rowKey="id"
        loading={loading}
        dataSource={users}
        columns={columns}
      />

      <Modal
        title={editingUser ? "编辑用户" : "新建用户"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: "请输入姓名" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: "请输入邮箱" },
              { type: "email", message: "邮箱格式不正确" },
            ]}
          >
            <Input disabled={!!editingUser} />
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: "请选择角色" }]}
          >
            <Select
              options={[
                { value: "admin", label: "管理员" },
                { value: "reviewer", label: "审核员" },
                { value: "operator", label: "操作员" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserPage;
