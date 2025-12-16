// frontend/src/pages/UserEdit.jsx
import React, { useEffect, useState } from "react";
import { Card, Form, Input, Select, Button, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { getUserDetail, updateUser } from "../api";

const UserEdit = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  useEffect(() => {
    setInitialLoading(true);
    getUserDetail(id)
      .then((data) => {
        form.setFieldsValue({
          name: data.name,
          email: data.email,
          role: data.role,
        });
      })
      .catch((e) => {
        console.error(e);
        message.error("加载用户信息失败");
      })
      .finally(() => setInitialLoading(false));
  }, [id, form]);

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      await updateUser(id, values);
      message.success("用户信息更新成功");
      navigate(`/users/${id}`);
    } catch (e) {
      console.error(e);
      const msg =
        e?.data?.errors
          ? Object.values(e.data.errors)
              .flat()
              .join("；")
          : e.message || "更新失败";
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title={`编辑用户 #${id}`} loading={initialLoading}>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="name"
          label="姓名"
          rules={[{ required: true, message: "请输入姓名" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="邮箱（不可修改）"
          rules={[
            { required: true, message: "请输入邮箱" },
            { type: "email", message: "邮箱格式不正确" },
          ]}
        >
          <Input disabled />
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
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            保存
          </Button>
          <Button
            style={{ marginLeft: 8 }}
            onClick={() => navigate(`/users/${id}`)}
          >
            取消
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default UserEdit;
