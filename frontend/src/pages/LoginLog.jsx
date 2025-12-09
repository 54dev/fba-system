// src/pages/LoginLog.jsx

import React, { useEffect, useState } from "react";
import { Table, Tag, message } from "antd";
import { fetchLoginLogs } from "../api";
import { formatDateTimeCn } from "../utils/time";

export default function LoginLog() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoginLogs()
      .then((res) => setData(res || []))
      .catch((err) => {
        console.error(err);
        message.error("加载登录日志失败");
      })
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 60,
    },
    {
      title: "用户",
      dataIndex: "user_name",
      render: (name, record) =>
        name || record.user?.name || "-",
    },
    {
      title: "邮箱",
      dataIndex: "user_email",
      render: (email, record) =>
        email || record.user?.email || "-",
    },
    {
      title: "IP 地址",
      dataIndex: "ip",
      render: (ip) => ip || "-",
    },
    {
      title: "登录状态",
      dataIndex: "status",
      render: (value) => {
        let color = "green";
        let text = "成功";
        if (value === "failed") {
          color = "red";
          text = "失败";
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "登录时间",
      dataIndex: "created_at",
      render: (value) => formatDateTimeCn(value),
    },
  ];

  return (
    <>
      <h2>登录日志</h2>
      <Table
        rowKey="id"
        loading={loading}
        dataSource={data}
        columns={columns}
      />
    </>
  );
}
