import React, { useEffect, useState } from "react";
import { Table, Tag, Button, message, Image } from "antd";
import { fetchProducts, updateProductReview } from "../api";

export default function ProductList() {
  const [products, setProducts] = useState([]);

  const loadProducts = () => {
    fetchProducts()
      .then((res) => setProducts(res))
      .catch(() => message.error("加载失败"));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleReview = async (id, result) => {
    try {
      await updateProductReview(id, { result });
      message.success("审核已更新");
      loadProducts();
    } catch {
      message.error("审核失败");
    }
  };

  const columns = [
    {
      title: "图片",
      dataIndex: "image_path",
      render: (path) => (
        <Image width={80} src={`/storage/${path}`} />
      ),
    },
    {
      title: "提交人",
      dataIndex: ["user", "name"],
    },
    {
      title: "参考链接",
      render: (_, row) => (
        <div>
          <a href={row.reference_link_1} target="_blank">链接1</a><br />
          {row.reference_link_2 && (
            <a href={row.reference_link_2} target="_blank">链接2</a>
          )}
          <br />
          {row.reference_link_3 && (
            <a href={row.reference_link_3} target="_blank">链接3</a>
          )}
        </div>
      ),
    },
    { title: "开发理由", dataIndex: "reason" },
    { title: "差异化", dataIndex: "differentiation" },
    {
      title: "审核状态",
      dataIndex: "review_result",
      render: (status) => {
        const map = {
          pending: <Tag color="gold">待审核</Tag>,
          approved: <Tag color="green">通过</Tag>,
          rejected: <Tag color="red">拒绝</Tag>,
        };
        return map[status];
      },
    },
    {
      title: "操作",
      render: (_, row) => (
        <div>
          <Button
            type="primary"
            onClick={() => handleReview(row.id, "approved")}
            style={{ marginRight: 10 }}
          >
            通过
          </Button>
          <Button
            danger
            onClick={() => handleReview(row.id, "rejected")}
          >
            拒绝
          </Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <h2>产品列表</h2>
      <Table rowKey="id" dataSource={products} columns={columns} />
    </div>
  );
}
