// src/pages/UserPage.jsx
import React, { useEffect, useState } from "react";
import { Table, Button } from "antd";
import { fetchUsers } from "../api";
import { Link } from "react-router-dom";

export default function UserPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers().then((res) => setUsers(res));
  }, []);

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "名称", dataIndex: "name" },
    { title: "邮箱", dataIndex: "email" },
    { title: "角色", dataIndex: "role" },
    {
      title: "操作",
      render: (_, r) => (
        <Link to={`/users/${r.id}`}>
          <Button type="primary">编辑</Button>
        </Link>
      ),
    },
  ];

  return (
    <div>
      <h2>用户管理</h2>
      <Table rowKey="id" columns={columns} dataSource={users} />
    </div>
  );
}
