// src/pages/ProductList.jsx

import React, { useEffect, useState } from "react";
import { Table, Tag, Space, Button, Modal, message, Image } from "antd";
import { useNavigate } from "react-router-dom";
import { fetchProducts, updateProductReview } from "../api";
import { formatDateTimeCn } from "../utils/time";

const { confirm } = Modal;

export default function ProductList({ user }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const role = user?.role || "operator";

  const load = () => {
    setLoading(true);
    fetchProducts()
      .then((res) => setData(res || []))
      .catch((err) => {
        console.error(err);
        message.error("加载产品列表失败");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const showReviewConfirm = (record, result) => {
    let title = result === "approved" ? "确认通过该产品？" : "确认拒绝该产品？";

    let commentValue = "";

    confirm({
      title,
      content: (
        <textarea
          style={{ width: "100%", minHeight: 80 }}
          placeholder="可选：填写审核意见"
          onChange={(e) => {
            commentValue = e.target.value;
          }}
        />
      ),
      okText: "确认",
      cancelText: "取消",
      async onOk() {
        try {
          await updateProductReview(record.id, {
            result,
            comment: commentValue,
          });
          message.success("审核结果已更新");
          load();
        } catch (err) {
          console.error(err);
          message.error(err.message || "审核失败");
        }
      },
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 60,
      render: (id) => (
        <Button
          type="link"
          onClick={() => navigate(`/products/${id}`)}
        >
          {id}
        </Button>
      ),
    },
    {
      title: "图片",
      dataIndex: "image_url",
      width: 120,
      render: (_, record) => {
        const url = record.image_url || record.image_path_url;
        if (!url) return "-";
        return (
          <Image
            src={url}
            width={80}
            style={{ objectFit: "cover" }}
            onClick={() => navigate(`/products/${record.id}`)}
          />
        );
      },
    },
    {
      title: "提交人",
      dataIndex: "user",
      render: (user) => user?.name || "-",
    },
    {
      title: "参考链接",
      dataIndex: "reference_link_1",
      render: (_, record) => {
        const links = [
          record.reference_link_1,
          record.reference_link_2,
          record.reference_link_3,
        ].filter(Boolean);

        if (links.length === 0) return "-";

        return (
          <div>
            {links.map((url, idx) => (
              <div key={idx}>
                <a href={url} target="_blank" rel="noreferrer">
                  链接 {idx + 1}
                </a>
              </div>
            ))}
          </div>
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
      title: "审核状态",
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
      title: "更新时间",
      dataIndex: "updated_at",
      render: (value) => formatDateTimeCn(value),
    },
    {
      title: "操作",
      key: "actions",
      width: 220,
      render: (_, record) => {
        const actions = [];

        // 管理员 / 审核员：审核按钮
        if (role === "admin" || role === "reviewer") {
          actions.push(
            <Button
              key="approve"
              type="link"
              onClick={() => showReviewConfirm(record, "approved")}
            >
              通过
            </Button>,
            <Button
              key="reject"
              type="link"
              danger
              onClick={() => showReviewConfirm(record, "rejected")}
            >
              拒绝
            </Button>
          );
        }

        // 操作员：在待审核 / 已拒绝时可以编辑
        if (
          role === "operator" &&
          (record.review_result === "pending" ||
            record.review_result === "rejected")
        ) {
          actions.push(
            <Button
              key="edit"
              type="link"
              onClick={() => navigate(`/products/${record.id}/edit`)}
            >
              编辑
            </Button>
          );
        }

        return <Space>{actions}</Space>;
      },
    },
  ];

  return (
    <>
      <h2>产品列表</h2>
      <Table
        rowKey="id"
        loading={loading}
        dataSource={data}
        columns={columns}
      />
    </>
  );
}
