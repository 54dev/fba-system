// src/pages/UserDetail.jsx
import React, { useEffect, useState } from "react";
import { getUserDetail, updateUser } from "../api";
import { useParams } from "react-router-dom";
import { Form, Input, Select, Button, message } from "antd";

export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    getUserDetail(id).then((res) => {
      setUser(res);
      form.setFieldsValue(res);
    });
  }, [id]);

  if (!user) return <p>加载中...</p>;

  const save = async () => {
    try {
      const values = form.getFieldsValue();
      await updateUser(id, values);
      message.success("保存成功");
    } catch (err) {
      message.error("保存失败：" + err.message);
    }
  };

  return (
    <div>
      <h2>用户详情 #{id}</h2>

      <Form form={form} layout="vertical">
        <Form.Item label="名称" name="name">
          <Input />
        </Form.Item>

        <Form.Item label="邮箱" name="email">
          <Input />
        </Form.Item>

        <Form.Item label="角色" name="role">
          <Select>
            <Select.Option value="operator">操作员</Select.Option>
            <Select.Option value="reviewer">审核员</Select.Option>
            <Select.Option value="admin">管理员</Select.Option>
          </Select>
        </Form.Item>

        <Button type="primary" onClick={save}>
          保存
        </Button>
      </Form>
    </div>
  );
}
