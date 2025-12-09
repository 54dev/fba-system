import React, { useEffect, useState } from "react";
import { Card, Descriptions, Button } from "antd";
import { fetchUserDetail } from "../api";
import { useParams, useNavigate } from "react-router-dom";

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserDetail(id).then((res) => setUser(res));
  }, [id]);

  if (!user) return <Card loading />;

  return (
    <Card
      title="用户详情"
      extra={<Button onClick={() => navigate(`/users/${id}/edit`)}>编辑</Button>}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="用户 ID">{user.id}</Descriptions.Item>
        <Descriptions.Item label="用户名">{user.name}</Descriptions.Item>
        <Descriptions.Item label="邮箱">{user.email}</Descriptions.Item>
        <Descriptions.Item label="角色">{user.role}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
}