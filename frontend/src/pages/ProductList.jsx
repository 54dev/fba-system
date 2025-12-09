// src/pages/ProductList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Tag, Space, Button, Image, message } from "antd";
import {
  fetchProducts,
  updateProductReview,
  formatDateTimeCn,
} from "../api";

export default function ProductList({ user }) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchProducts();
      setProducts(Array.isArray(res) ? res : res.data || []);
    } catch (e) {
      console.error(e);
      message.error(e.message || "加载产品列表失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReview = async (record, result) => {
    const actionText = result === "approved" ? "通过" : "拒绝";
    const comment =
      window.prompt(`请输入【${actionText}】备注（可选）：`, "") || "";

    try {
      await updateProductReview(record.id, { result, comment });
      message.success(`已${actionText}`);
      loadData();
    } catch (e) {
      console.error(e);
      message.error(e.message || `${actionText}失败`);
    }
  };

  const getImageUrl = (record) =>
    record.image_url || record.imageUrl || record.image_path || record.imagePath;

  const columns = [
    {
      title: "产品 ID",
      dataIndex: "id",
      width: 80,
      render: (id, record) => (
        <a onClick={() => navigate(`/products/${record.id}`)}>{id}</a>
      ),
    },
    {
      title: "图片",
      dataIndex: "image",
      width: 110,
      render: (_, record) => {
        const url = getImageUrl(record);
        if (!url) return "-";
        return <Image width={90} src={url} />;
      },
    },
    {
      title: "提交人",
      dataIndex: ["user", "name"],
      render: (_, record) => record.user?.name || "-",
    },
    {
      title: "参考链接",
      key: "links",
      render: (_, record) => {
        const links = [
          record.reference_link_1,
          record.reference_link_2,
          record.reference_link_3,
        ].filter(Boolean);

        if (links.length === 0) return "-";

        return (
          <Space direction="vertical">
            {record.reference_link_1 && (
              <a
                href={record.reference_link_1}
                target="_blank"
                rel="noreferrer"
              >
                参考链接 1
              </a>
            )}
            {record.reference_link_2 && (
              <a
                href={record.reference_link_2}
                target="_blank"
                rel="noreferrer"
              >
                参考链接 2
              </a>
            )}
            {record.reference_link_3 && (
              <a
                href={record.reference_link_3}
                target="_blank"
                rel="noreferrer"
              >
                参考链接 3
              </a>
            )}
          </Space>
        );
      },
    },
    {
      title: "开发理由",
      dataIndex: "reason",
      ellipsis: true,
    },
    {
      title: "差异化",
      dataIndex: "differentiation",
      ellipsis: true,
    },
    {
      title: "状态",
      dataIndex: "review_result",
      width: 100,
      render: (value) => {
        let color = "default";
        let text = "待审核";
        if (value === "approved") {
          color = "green";
          text = "已通过";
        } else if (value === "rejected") {
          color = "red";
          text = "已拒绝";
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      width: 180,
      render: (val) => formatDateTimeCn(val),
    },
    {
      title: "操作",
      key: "action",
      width: 180,
      render: (_, record) => {
        // 只有 管理员 & 审核员 才能看到审核按钮
        if (!user || (user.role !== "admin" && user.role !== "reviewer")) {
          return "-";
        }

        const disabled = record.review_result === "approved";

        return (
          <Space>
            <Button
              size="small"
              type="primary"
              disabled={disabled}
              onClick={() => handleReview(record, "approved")}
            >
              通过
            </Button>
            <Button
              size="small"
              danger
              disabled={disabled}
              onClick={() => handleReview(record, "rejected")}
            >
              拒绝
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>产品列表</h2>
      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={products}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}
