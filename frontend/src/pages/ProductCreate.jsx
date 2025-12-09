// src/pages/ProductCreate.jsx
import React, { useState } from "react";
import { createProduct } from "../api";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

export default function ProductCreate() {
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [link1, setLink1] = useState("");
  const [link2, setLink2] = useState("");
  const [link3, setLink3] = useState("");
  const [reason, setReason] = useState("");
  const [diff, setDiff] = useState("");

  const submit = async () => {
    try {
      const fd = new FormData();
      fd.append("image", image);
      fd.append("reference_link_1", link1);
      fd.append("reference_link_2", link2);
      fd.append("reference_link_3", link3);
      fd.append("reason", reason);
      fd.append("differentiation", diff);

      await createProduct(fd);

      message.success("提交成功");
      navigate("/products");
    } catch (e) {
      const readable = e.response?.data?.message || e.message || "未知错误";
      message.error("提交失败：" + readable);
    }
  };

  return (
    <div>
      <h2>添加产品</h2>

      <p>图片：</p>
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />

      <p>参考链接 1</p>
      <input value={link1} onChange={(e) => setLink1(e.target.value)} />

      <p>参考链接 2</p>
      <input value={link2} onChange={(e) => setLink2(e.target.value)} />

      <p>参考链接 3</p>
      <input value={link3} onChange={(e) => setLink3(e.target.value)} />

      <p>开发理由</p>
      <textarea value={reason} onChange={(e) => setReason(e.target.value)} />

      <p>差异化</p>
      <textarea value={diff} onChange={(e) => setDiff(e.target.value)} />

      <button onClick={submit}>提交</button>
    </div>
  );
}
