// frontend/src/pages/ProductCreate.jsx
import React, { useEffect, useState } from "react";
import { Card, Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { createProduct, updateProduct, getProductDetail } from "../api";

const { TextArea } = Input;

const ProductCreate = ({ user }) => {
  const [form] = Form.useForm();
  const [uploadFile, setUploadFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  useEffect(() => {
    if (!isEdit) return;
    setInitialLoading(true);
    getProductDetail(id)
      .then((data) => {
        form.setFieldsValue({
          reference_link_1: data.reference_link_1 || "",
          reference_link_2: data.reference_link_2 || "",
          reference_link_3: data.reference_link_3 || "",
          reason: data.reason || "",
          differentiation: data.differentiation || "",
        });
      })
      .catch((e) => {
        console.error(e);
        message.error("加载产品信息失败");
      })
      .finally(() => setInitialLoading(false));
  }, [id, isEdit, form]);

  const handleFinish = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();

      if (uploadFile) {
        formData.append("image", uploadFile);
      } else if (!isEdit) {
        message.error("请上传产品图片");
        setLoading(false);
        return;
      }

      formData.append("reference_link_1", values.reference_link_1 || "");
      if (values.reference_link_2)
        formData.append("reference_link_2", values.reference_link_2);
      if (values.reference_link_3)
        formData.append("reference_link_3", values.reference_link_3);
      formData.append("reason", values.reason || "");
      formData.append("differentiation", values.differentiation || "");

      if (isEdit) {
        await updateProduct(id, formData);
        message.success("产品编辑成功");
      } else {
        await createProduct(formData);
        message.success("产品提交成功");
      }
      navigate("/products");
    } catch (e) {
      console.error(e);
      const msg =
        e?.data?.errors
          ? Object.values(e.data.errors)
              .flat()
              .join("；")
          : e.message || "提交失败，请检查输入内容";
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title={isEdit ? "编辑产品" : "添加产品"}
      loading={initialLoading}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          reference_link_1: "",
          reference_link_2: "",
          reference_link_3: "",
          reason: "",
          differentiation: "",
        }}
      >
        {!isEdit && (
          <Form.Item
            label="产品图片"
            name="image"
            rules={[{ required: true, message: "请上传产品图片" }]}
          >
            <Upload
              beforeUpload={(file) => {
                setUploadFile(file);
                return false;
              }}
              maxCount={1}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>选择图片</Button>
            </Upload>
          </Form.Item>
        )}

        {isEdit && (
          <Form.Item label="产品图片（如需更换请重新上传）">
            <Upload
              beforeUpload={(file) => {
                setUploadFile(file);
                return false;
              }}
              maxCount={1}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>重新选择图片</Button>
            </Upload>
          </Form.Item>
        )}

        <Form.Item
          label="参考链接 1"
          name="reference_link_1"
          rules={[{ required: true, message: "请输入参考链接 1" }]}
        >
          <Input placeholder="参考链接 1" />
        </Form.Item>

        <Form.Item label="参考链接 2" name="reference_link_2">
          <Input placeholder="参考链接 2（可选）" />
        </Form.Item>

        <Form.Item label="参考链接 3" name="reference_link_3">
          <Input placeholder="参考链接 3（可选）" />
        </Form.Item>

        <Form.Item
          label="开发理由"
          name="reason"
          rules={[{ required: true, message: "请输入开发理由" }]}
        >
          <TextArea rows={4} placeholder="请描述为什么要开发该产品" />
        </Form.Item>

        <Form.Item
          label="差异化"
          name="differentiation"
          rules={[{ required: true, message: "请输入差异化" }]}
        >
          <TextArea rows={4} placeholder="请描述该产品的差异化优势" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isEdit ? "保存修改" : "提交产品"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ProductCreate;
