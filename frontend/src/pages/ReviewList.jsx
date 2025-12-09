// src/pages/ReviewList.jsx
import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { fetchReviews } from "../api";
import { formatDateTimeCn } from "../utils/time";
import { Link } from "react-router-dom";

export default function ReviewList() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews().then((res) => setReviews(res));
  }, []);

  const columns = [
    {
      title: "产品 ID",
      render: (_, r) => <Link to={`/products/${r.product_id}`}>{r.product_id}</Link>,
    },
    {
      title: "审核员",
      render: (_, r) =>
        r.user ? <Link to={`/users/${r.user.id}`}>{r.user.name}</Link> : "未知",
    },
    {
      title: "审核结果",
      dataIndex: "result",
    },
    {
      title: "备注",
      dataIndex: "comment",
    },
    {
      title: "时间",
      render: (_, r) => formatDateTimeCn(r.created_at),
    },
  ];

  return (
    <div>
      <h2>审核记录</h2>
      <Table rowKey="id" dataSource={reviews} columns={columns} />
    </div>
  );
}
