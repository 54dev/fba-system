import React, { useEffect, useState } from "react";
import { Table, Tag, message } from "antd";
import { fetchReviews } from "../api";

export default function ReviewList() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews()
      .then(setReviews)
      .catch(() => message.error("加载失败"));
  }, []);

  const columns = [
    { title: "产品ID", dataIndex: "product_id" },
    { title: "审核人ID", dataIndex: "reviewer_id" },
    {
      title: "审核结果",
      dataIndex: "result",
      render: (r) =>
        r === "approved" ? (
          <Tag color="green">通过</Tag>
        ) : (
          <Tag color="red">拒绝</Tag>
        ),
    },
    { title: "备注", dataIndex: "comment" },
    { title: "时间", dataIndex: "created_at" },
  ];

  return (
    <div>
      <h2>审核记录</h2>
      <Table rowKey="id" columns={columns} dataSource={reviews} />
    </div>
  );
}
