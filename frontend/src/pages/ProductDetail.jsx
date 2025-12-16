// frontend/src/pages/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { Card, Descriptions, Tag, Space, Button, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { getProductDetail } from "../api";
import { formatDateTimeCn } from "../utils/time";

const statusColorMap = {
  pending: "gold",
  approved: "green",
  rejected: "red",
};

const ProductDetail = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    setLoading(true);
    getProductDetail(id)
      .then((res) => setProduct(res))
      .catch((e) => {
        console.error(e);
        message.error("加载产品详情失败");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (!product) {
    return <Card loading={loading}>加载中...</Card>;
  }

  const canEdit =
    user &&
    (user.role === "admin" || user.role === "operator") &&
    product.review_result !== "approved" &&
    (user.role !== "operator" || product.user_id === user.id);

  const status = product.review_result;
  const color = statusColorMap[status] || "default";
  let statusText = status;
  if (status === "pending") statusText = "待审核";
  if (status === "approved") statusText = "已通过";
  if (status === "rejected") statusText = "已拒绝";

  const links = [
    product.reference_link_1,
    product.reference_link_2,
    product.reference_link_3,
  ].filter(Boolean);

  const lastReview =
    product.latest_review ||
    product.latestReview ||
    (Array.isArray(product.reviews) ? product.reviews[0] : null);

  return (
    <Card
      title={`产品详情 #${product.id}`}
      extra={
        canEdit && (
          <Button
            type="primary"
            onClick={() => navigate(`/products/${product.id}/edit`)}
          >
            编辑产品
          </Button>
        )
      }
      loading={loading}
    >
      <Space align="start" size={24}>
        {product.image_url || product.image_path || product.image ? (
          <img
            src={
              product.image_url ||
              product.image_path ||
              product.image
            }
            alt="产品图"
            style={{ width: 200, height: 200, objectFit: "cover" }}
          />
        ) : null}

        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="产品 ID">
            {product.id}
          </Descriptions.Item>
          <Descriptions.Item label="提交人">
            {product.user?.name || `用户#${product.user_id}`}
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={color}>{statusText}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="参考链接">
            {links.length ? (
              <Space direction="vertical">
                {links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    链接 {idx + 1}
                  </a>
                ))}
              </Space>
            ) : (
              "-"
            )}
          </Descriptions.Item>
          <Descriptions.Item label="开发理由">
            {product.reason || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="差异化">
            {product.differentiation || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="提交时间">
            {formatDateTimeCn(product.created_at)}
          </Descriptions.Item>
          <Descriptions.Item label="最后更新时间">
            {formatDateTimeCn(product.updated_at)}
          </Descriptions.Item>
          {lastReview && (
            <>
              <Descriptions.Item label="最新审核结果">
                {lastReview.result === "approved"
                  ? "通过"
                  : lastReview.result === "rejected"
                  ? "拒绝"
                  : "待审核"}
              </Descriptions.Item>
              <Descriptions.Item label="审核人">
                {lastReview.reviewer?.name ||
                  `ID: ${lastReview.reviewer_id}`}
              </Descriptions.Item>
              <Descriptions.Item label="审核时间">
                {formatDateTimeCn(lastReview.created_at)}
              </Descriptions.Item>
              <Descriptions.Item label="审核意见">
                {lastReview.comment || "-"}
              </Descriptions.Item>
            </>
          )}
        </Descriptions>
      </Space>
    </Card>
  );
};

export default ProductDetail;
