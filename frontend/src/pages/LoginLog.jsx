// frontend/src/pages/LoginLog.jsx
import React, { useEffect, useState } from "react";
import { Table, message } from "antd";
import { Link } from "react-router-dom";
import { fetchLoginLogs } from "../api";
import { formatDateTimeCn } from "../utils/time";

const LoginLog = () => {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetchLoginLogs()
      .then((res) => setLogs(Array.isArray(res) ? res : []))
      .catch((e) => {
        console.error(e);
        message.error("加载登录日志失败");
      })
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "用户",
      dataIndex: "user_name",
      render: (val, record) =>
        record.user_id ? (
          <Link to={`/users/${record.user_id}`}>{val || `用户#${record.user_id}`}</Link>
        ) : (
          val || "-"
        ),
    },
    {
      title: "IP 地址",
      dataIndex: "ip_address",
      render: (val, record) => val || record.ip || "-",
    },
    {
      title: "登录时间",
      dataIndex: "created_at",
      render: (val) => formatDateTimeCn(val),
    },
  ];

  return (
    <Table
      rowKey="id"
      loading={loading}
      dataSource={logs}
      columns={columns}
    />
  );
};

export default LoginLog;
