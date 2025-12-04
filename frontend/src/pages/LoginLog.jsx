import React, { useEffect, useState } from "react";
import { Table, message } from "antd";
import { fetchLoginLogs } from "../api";

export default function LoginLog() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLoginLogs()
      .then(setLogs)
      .catch(() => message.error("加载登录日志失败"));
  }, []);

  const columns = [
    { title: "用户", dataIndex: ["user", "name"] },
    { title: "IP 地址", dataIndex: "ip_address" },
    { title: "登录时间", dataIndex: "logged_in_at" },
  ];

  return (
    <div>
      <h2>登录日志</h2>
      <Table rowKey="id" columns={columns} dataSource={logs} />
    </div>
  );
}
