// frontend/src/pages/ReviewList.jsx
import React, { useEffect, useState } from "react";
import { Table, Tag, message } from "antd";
import { Link } from "react-router-dom";
import { fetchReviews } from "../api";
import { formatDateTimeCn } from "../utils/time";

const ReviewList = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetchReviews()
      .then((res) => setData(Array.isArray(res) ? res : []))
      .catch((e) => {
        console.error(e);
        message.error("加载审核记录失败");
      })
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "产品",
      dataIndex: "product_id",
      render: (id) => <Link to={`/products/${id}`}>产品 #{id}</Link>,
    },
    {
      title: "审核人",
      render: (_, record) =>
        record.reviewer?.name || `ID: ${record.reviewer_id}`,
    },
    {
      title: "结果",
      dataIndex: "result",
      render: (val) => {
        let color = "default";
        let text = val;
        if (val === "approved") {
          color = "green";
          text = "通过";
        } else if (val === "rejected") {
          color = "red";
          text = "拒绝";
        }
        return <Tag color={color}>{text || "-"}</Tag>;
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
      render: (val) => formatDateTimeCn(val),
    },
  ];

  return (
    <Table
      rowKey="id"
      loading={loading}
      dataSource={data}
      columns={columns}
    />
  );
};

export default ReviewList;
