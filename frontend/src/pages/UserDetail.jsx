// frontend/src/pages/UserDetail.jsx
import React, { useEffect, useState } from "react";
import { Card, Descriptions, Tag, Button, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { getUserDetail } from "../api";
import { formatDateTimeCn } from "../utils/time";

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userDetail, setUserDetail] = useState(null);

  useEffect(() => {
    setLoading(true);
    getUserDetail(id)
      .then((data) => setUserDetail(data))
      .catch((e) => {
        console.error(e);
        message.error("加载用户信息失败");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (!userDetail) {
    return <Card loading={loading}>加载中...</Card>;
  }

  const role = userDetail.role;
  let roleColor = "default";
  let roleText = role;
  if (role === "admin") {
    roleColor = "red";
    roleText = "管理员";
  } else if (role === "reviewer") {
    roleColor = "blue";
    roleText = "审核员";
  } else if (role === "operator") {
    roleColor = "green";
    roleText = "操作员";
  }

  return (
    <Card
      title={`用户详情 #${userDetail.id}`}
      extra={
        <Button onClick={() => navigate(`/users/${userDetail.id}/edit`)}>
          编辑用户
        </Button>
      }
      loading={loading}
    >
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="用户 ID">
          {userDetail.id}
        </Descriptions.Item>
        <Descriptions.Item label="姓名">
          {userDetail.name}
        </Descriptions.Item>
        <Descriptions.Item label="邮箱">
          {userDetail.email}
        </Descriptions.Item>
        <Descriptions.Item label="角色">
          <Tag color={roleColor}>{roleText}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">
          {formatDateTimeCn(userDetail.created_at)}
        </Descriptions.Item>
        <Descriptions.Item label="更新时间">
          {formatDateTimeCn(userDetail.updated_at)}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default UserDetail;
