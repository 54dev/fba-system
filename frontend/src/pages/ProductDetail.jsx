// src/pages/ProductDetail.jsx

import React, { useEffect, useState } from "react";
import { Card, Descriptions, Image, Spin, Tag, message } from "antd";
import { useParams } from "react-router-dom";
import { getProductDetail } from "../api";
import { formatDateTimeCn } from "../utils/time";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductDetail(id)
      .then((data) => setProduct(data))
      .catch((err) => {
        console.error(err);
        message.error("加载产品详情失败");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <Spin tip="加载中..." />;
  }

  if (!product) {
    return <div>未找到该产品</div>;
  }

  let statusText = "待审核";
  let statusColor = "default";
  if (product.review_result === "approved") {
    statusText = "已通过";
    statusColor = "green";
  } else if (product.review_result === "rejected") {
    statusText = "已拒绝";
    statusColor = "red";
  }

  const imgUrl = product.image_url || product.image_path_url;

  return (
    <Card title={`产品详情 #${product.id}`}>
      <Descriptions column={2} bordered size="middle">
        <Descriptions.Item label="产品图片" span={2}>
          {imgUrl ? (
            <Image src={imgUrl} width={240} />
          ) : (
            "-"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="提交人">
          {product.user?.name} ({product.user?.email})
        </Descriptions.Item>
        <Descriptions.Item label="审核状态">
          <Tag color={statusColor}>{statusText}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="参考链接" span={2}>
          <div>
            {product.reference_link_1 && (
              <div>
                <a
                  href={product.reference_link_1}
                  target="_blank"
                  rel="noreferrer"
                >
                  链接 1
                </a>
              </div>
            )}
            {product.reference_link_2 && (
              <div>
                <a
                  href={product.reference_link_2}
                  target="_blank"
                  rel="noreferrer"
                >
                  链接 2
                </a>
              </div>
            )}
            {product.reference_link_3 && (
              <div>
                <a
                  href={product.reference_link_3}
                  target="_blank"
                  rel="noreferrer"
                >
                  链接 3
                </a>
              </div>
            )}
            {!product.reference_link_1 &&
              !product.reference_link_2 &&
              !product.reference_link_3 &&
              "-"}
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="开发理由" span={2}>
          {product.reason || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="差异化" span={2}>
          {product.differentiation || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">
          {formatDateTimeCn(product.created_at)}
        </Descriptions.Item>
        <Descriptions.Item label="更新时间">
          {formatDateTimeCn(product.updated_at)}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
}
