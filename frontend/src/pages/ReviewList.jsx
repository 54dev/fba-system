// src/pages/ReviewList.jsx

import React, { useEffect, useState } from "react";
import { Table, Tag, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { fetchReviews } from "../api";
import { formatDateTimeCn } from "../utils/time";

export default function ReviewList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReviews()
      .then((res) => setData(res || []))
      .catch((err) => {
        console.error(err);
        message.error("加载审核记录失败");
      })
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    {
      title: "审核记录 ID",
      dataIndex: "id",
      width: 80,
    },
    {
      title: "产品 ID",
      dataIndex: "product_id",
      render: (id, record) => (
        <Button
          type="link"
          onClick={() => navigate(`/products/${id}`)}
        >
          #{id}
        </Button>
      ),
    },
    {
      title: "审核人",
      dataIndex: "reviewer_name",
      render: (_, record) => {
        const name = record.reviewer_name || record.reviewer?.name;
        const id = record.reviewer_id || record.reviewer?.id;
        if (!name || !id) return name || "-";
        return (
          <Button
            type="link"
            onClick={() => navigate(`/users/${id}`)}
          >
            {name}
          </Button>
        );
      },
    },
    {
      title: "审核结果",
      dataIndex: "result",
      render: (value) => {
        let color = "default";
        let text = value;
        if (value === "approved") {
          color = "green";
          text = "通过";
        } else if (value === "rejected") {
          color = "red";
          text = "拒绝";
        } else if (value === "pending") {
          text = "待审核";
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "审核意见",
      dataIndex: "comment",
      ellipsis: true,
    },
    {
      title: "审核时间",
      dataIndex: "created_at",
      render: (value) => formatDateTimeCn(value),
    },
  ];

  return (
    <>
      <h2>审核记录</h2>
      <Table
        rowKey="id"
        loading={loading}
        dataSource={data}
        columns={columns}
      />
    </>
  );
}
