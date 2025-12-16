// frontend/src/pages/ProductList.jsx
import React, { useEffect, useState } from "react";
import { Table, Button, Tag, Space, message, Tooltip } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchProducts,
  updateProductReview,
} from "../api";
import { formatDateTimeCn } from "../utils/time";

const statusColorMap = {
  pending: "gold",
  approved: "green",
  rejected: "red",
};

const ProductList = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const role = user?.role;

  const loadData = () => {
    setLoading(true);
    fetchProducts()
      .then((res) => {
        setData(Array.isArray(res) ? res : []);
      })
      .catch((e) => {
        console.error(e);
        message.error("加载产品列表失败");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReview = async (record, result) => {
    try {
      await updateProductReview(record.id, {
        result,
        comment: "",
      });
      message.success("审核操作成功");
      loadData();
    } catch (e) {
      console.error(e);
      message.error(e.message || "审核失败");
    }
  };

  const canEditProduct = (record) => {
    // 仅本人 + 待审核/拒绝 才可编辑
    if (!user) return false;
    if (role !== "operator" && role !== "admin") return false;
    if (role === "operator" && record.user_id !== user.id) return false;
    return record.review_result !== "approved";
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id) => <Link to={`/products/${id}`}>{id}</Link>,
    },
    {
      title: "图片",
      dataIndex: "image_url",
      render: (_, record) => {
        const url =
          record.image_url ||
          record.image_path ||
          record.image ||
          "";
        if (!url) return "-";
        return (
          <img
            src={url}
            alt="产品图"
            style={{ width: 60, height: 60, objectFit: "cover" }}
          />
        );
      },
    },
    {
      title: "提交人",
      dataIndex: ["user", "name"],
      render: (_, record) => record.user?.name || `用户#${record.user_id}`,
    },
    {
      title: "参考链接",
      render: (_, record) => {
        const links = [
          record.reference_link_1,
          record.reference_link_2,
          record.reference_link_3,
        ].filter(Boolean);
        if (!links.length) return "-";
        return (
          <Space direction="vertical" size={0}>
            {links.map((link, idx) => (
              <a
                key={idx}
                href={link}
                target="_blank"
                rel="noreferrer"
                style={{ display: "block", maxWidth: 220 }}
              >
                <Tooltip title={link}>
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      display: "inline-block",
                      maxWidth: 220,
                    }}
                  >
                    链接 {idx + 1}
                  </span>
                </Tooltip>
              </a>
            ))}
          </Space>
        );
      },
    },
    {
      title: "状态",
      dataIndex: "review_result",
      render: (val) => {
        const color = statusColorMap[val] || "default";
        let text = val;
        if (val === "pending") text = "待审核";
        if (val === "approved") text = "已通过";
        if (val === "rejected") text = "已拒绝";
        return <Tag color={color}>{text || "-"}</Tag>;
      },
    },
    {
      title: "最新审核",
      render: (_, record) => {
        const review = record.latest_review || record.latestReview;
        if (!review) return "-";
        const reviewerName =
          review.reviewer?.name || `ID: ${review.reviewer_id}`;
        const result = review.result;
        const resultText =
          result === "approved"
            ? "通过"
            : result === "rejected"
            ? "拒绝"
            : "待审核";

        return (
          <div>
            <div>结果：{resultText}</div>
            <div>审核人：{reviewerName}</div>
          </div>
        );
      },
    },
    {
      title: "提交时间",
      dataIndex: "created_at",
      render: (val) => formatDateTimeCn(val),
    },
    {
      title: "操作",
      render: (_, record) => {
        const actions = [];

        if (canEditProduct(record)) {
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

        if (role === "admin" || role === "reviewer") {
          actions.push(
            <Button
              key="approve"
              type="link"
              onClick={() => handleReview(record, "approved")}
              disabled={record.review_result === "approved"}
            >
              通过
            </Button>
          );
          actions.push(
            <Button
              key="reject"
              type="link"
              danger
              onClick={() => handleReview(record, "rejected")}
              disabled={record.review_result === "rejected"}
            >
              拒绝
            </Button>
          );
        }

        if (!actions.length) return "-";
        return <Space>{actions}</Space>;
      },
    },
  ];

  return (
    <div>
      <Table
        rowKey="id"
        loading={loading}
        dataSource={data}
        columns={columns}
      />
    </div>
  );
};

export default ProductList;
