import React, { useEffect, useState } from "react";
import { Table, Tag, Image, Button, Space, message } from "antd";
import { fetchProducts, updateProductReview } from "../api";

export default function ProductList({ user }) {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  // 加载产品列表
  useEffect(() => {
    setLoading(true);

    fetchProducts()
      .then((res) => {
        if (Array.isArray(res)) {
          setProducts(res);
        } else {
          message.error("产品数据格式异常");
        }
      })
      .catch((err) => {
        console.error("加载产品失败:", err);
        message.error("加载产品失败");
      })
      .finally(() => setLoading(false));
  }, []);

  // 审核操作
  const handleReview = async (record, result) => {
    try {
      await updateProductReview(record.id, {
        result,
        comment: null,
      });

      message.success(
        result === "approved" ? "已通过该产品" : "已拒绝该产品"
      );

      // 本地更新状态，避免重新刷新整页
      setProducts((prev) =>
        prev.map((p) =>
          p.id === record.id ? { ...p, review_result: result } : p
        )
      );
    } catch (err) {
      console.error("更新审核状态失败:", err);
      message.error("更新审核状态失败");
    }
  };

  // 基本列（所有角色都能看到）
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 70,
    },
    {
      title: "图片",
      dataIndex: "image_path",
      render: (path) => (
        <Image
          width={80}
          src={`http://localhost/storage/${path}`}
          fallback="https://via.placeholder.com/80"
        />
      ),
    },
    {
      title: "参考链接 1",
      dataIndex: "reference_link_1",
      render: (v) =>
        v ? (
          <a href={v} target="_blank" rel="noreferrer">
            打开
          </a>
        ) : (
          "-"
        ),
    },
    {
      title: "提交人",
      dataIndex: ["user", "name"],
      render: (v) => v || "未知用户",
    },
    {
      title: "审核状态",
      dataIndex: "review_result",
      render: (status) => {
        const map = {
          approved: { color: "green", text: "通过" },
          rejected: { color: "red", text: "拒绝" },
          pending: { color: "gold", text: "待审核" },
        };
        const info = map[status] || map.pending;
        return <Tag color={info.color}>{info.text}</Tag>;
      },
    },
  ];

  // 只有 admin / reviewer 才能看到的“审核操作”列
  const canReview =
    user && (user.role === "admin" || user.role === "reviewer");

  if (canReview) {
    columns.push({
      title: "审核操作",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            onClick={() => handleReview(record, "approved")}
            disabled={record.review_result === "approved"}
          >
            通过
          </Button>
          <Button
            danger
            size="small"
            onClick={() => handleReview(record, "rejected")}
            disabled={record.review_result === "rejected"}
          >
            拒绝
          </Button>
        </Space>
      ),
    });
  }

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>产品列表</h2>
      <Table
        rowKey="id"
        loading={loading}
        dataSource={products}
        columns={columns}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}