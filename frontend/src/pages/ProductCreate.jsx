import React, { useState } from "react";
import { Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { createProduct } from "../api";
import { useNavigate } from "react-router-dom";

export default function ProductCreate() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  const onFinish = async (values) => {
    if (!file) {
      message.error("请上传产品图片");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("reference_link_1", values.reference_link_1);
    if (values.reference_link_2) formData.append("reference_link_2", values.reference_link_2);
    if (values.reference_link_3) formData.append("reference_link_3", values.reference_link_3);
    formData.append("reason", values.reason);
    formData.append("differentiation", values.differentiation);

    try {
      await createProduct(formData);
      message.success("提交成功");
      navigate("/products");
    } catch (err) {
      message.error("提交失败");
    }
  };

  return (
    <div>
      <h2>添加产品</h2>

      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="产品图片">
          <Upload
            beforeUpload={(file) => {
              setFile(file);
              return false;
            }}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>上传图片</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label="参考链接 1"
          name="reference_link_1"
          rules={[{ required: true, message: "请输入参考链接 1" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="参考链接 2" name="reference_link_2">
          <Input />
        </Form.Item>

        <Form.Item label="参考链接 3" name="reference_link_3">
          <Input />
        </Form.Item>

        <Form.Item
          label="开发理由"
          name="reason"
          rules={[{ required: true, message: "请输入开发理由" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          label="差异化（定价/配置）"
          name="differentiation"
          rules={[{ required: true, message: "请输入差异化信息" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form>
    </div>
  );
}
