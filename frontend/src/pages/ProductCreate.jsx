// src/pages/ProductCreate.jsx

import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  message,
  Space,
  Card,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import {
  createProduct,
  getProductDetail,
  updateProduct,
} from "../api";

export default function ProductCreate() {
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);

  const navigate = useNavigate();
  const { id: productId } = useParams();
  const isEdit = Boolean(productId);

  // 编辑模式：加载详情
  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    getProductDetail(productId)
      .then((data) => {
        if (!data) return;
        form.setFieldsValue({
          reference_link_1: data.reference_link_1,
          reference_link_2: data.reference_link_2,
          reference_link_3: data.reference_link_3,
          reason: data.reason,
          differentiation: data.differentiation,
        });
        setInitialLoaded(true);
      })
      .catch((err) => {
        console.error(err);
        message.error("加载产品详情失败");
      })
      .finally(() => setLoading(false));
  }, [isEdit, productId, form]);

  const handleFinish = async (values) => {
    setLoading(true);

    try {
      if (!isEdit) {
        // 新建：必须有图片
        if (!imageFile) {
          message.error("请上传产品图片");
          setLoading(false);
          return;
        }
        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("reference_link_1", values.reference_link_1);
        if (values.reference_link_2) {
          formData.append("reference_link_2", values.reference_link_2);
        }
        if (values.reference_link_3) {
          formData.append("reference_link_3", values.reference_link_3);
        }
        formData.append("reason", values.reason);
        formData.append("differentiation", values.differentiation);

        await createProduct(formData);
        message.success("产品提交成功");
      } else {
        // 编辑：只更新文字部分（如需更新图片，可扩展为 FormData）
        await updateProduct(productId, {
          reference_link_1: values.reference_link_1,
          reference_link_2: values.reference_link_2 || null,
          reference_link_3: values.reference_link_3 || null,
          reason: values.reason,
          differentiation: values.differentiation,
        });
        message.success("产品已更新");
      }

      navigate("/products");
    } catch (err) {
      console.error(err);
      message.error(
        err.message || (isEdit ? "更新失败" : "提交失败，请检查输入内容")
      );
    } finally {
      setLoading(false);
    }
  };

  // 编辑模式还没拉到数据，显示一个空壳避免闪烁
  if (isEdit && !initialLoaded && loading) {
    return <div>加载中...</div>;
  }

  return (
    <Card title={isEdit ? "编辑产品" : "添加产品"}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        {!isEdit && (
          <Form.Item
            label="产品图片"
            required
            extra="仅新建时可上传；编辑时暂不支持修改图片"
          >
            <Upload
              beforeUpload={(file) => {
                setImageFile(file);
                return false; // 阻止自动上传
              }}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>选择图片</Button>
            </Upload>
            {!imageFile && (
              <div style={{ color: "#999", marginTop: 4 }}>
                当前未选择图片
              </div>
            )}
          </Form.Item>
        )}

        <Form.Item
          label="参考链接 1"
          name="reference_link_1"
          rules={[
            { required: true, message: "请填写参考链接 1" },
            { type: "url", message: "请输入合法的 URL" },
          ]}
        >
          <Input placeholder="https://..." />
        </Form.Item>

        <Form.Item
          label="参考链接 2（可选）"
          name="reference_link_2"
          rules={[{ type: "url", message: "请输入合法的 URL" }]}
        >
          <Input placeholder="https://..." />
        </Form.Item>

        <Form.Item
          label="参考链接 3（可选）"
          name="reference_link_3"
          rules={[{ type: "url", message: "请输入合法的 URL" }]}
        >
          <Input placeholder="https://..." />
        </Form.Item>

        <Form.Item
          label="开发理由"
          name="reason"
          rules={[{ required: true, message: "请填写开发理由" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="差异化"
          name="differentiation"
          rules={[{ required: true, message: "请填写差异化" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              {isEdit ? "保存修改" : "提交"}
            </Button>
            <Button onClick={() => navigate("/products")}>返回列表</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
}
