// src/pages/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductDetail, updateProduct } from "../api";
import { Button, Input, Form, message } from "antd";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form] = Form.useForm();

  useEffect(() => {
    getProductDetail(id).then((res) => {
      setProduct(res);
      form.setFieldsValue(res);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <p>加载中...</p>;
  if (!product) return <p>不存在该产品</p>;

  const editable = ["pending", "rejected"].includes(product.review_result);

  const handleSave = async () => {
    try {
      const values = form.getFieldsValue();

      const fd = new FormData();
      if (values.image) fd.append("image", values.image.file);
      fd.append("reference_link_1", values.reference_link_1);
      fd.append("reference_link_2", values.reference_link_2 || "");
      fd.append("reference_link_3", values.reference_link_3 || "");
      fd.append("reason", values.reason);
      fd.append("differentiation", values.differentiation);

      await updateProduct(id, fd);
      message.success("保存成功");
    } catch (err) {
      message.error("保存失败：" + err.message);
    }
  };

  return (
    <div>
      <h2>产品详情 #{id}</h2>

      <Form form={form} layout="vertical" disabled={!editable}>
        <Form.Item label="参考链接 1" name="reference_link_1">
          <Input />
        </Form.Item>

        <Form.Item label="参考链接 2" name="reference_link_2">
          <Input />
        </Form.Item>

        <Form.Item label="参考链接 3" name="reference_link_3">
          <Input />
        </Form.Item>

        <Form.Item label="开发理由" name="reason">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item label="差异化" name="differentiation">
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>

      {editable ? (
        <Button type="primary" onClick={handleSave}>
          保存
        </Button>
      ) : (
        <p style={{ color: "gray" }}>产品已通过审核，不能再编辑。</p>
      )}
    </div>
  );
}
