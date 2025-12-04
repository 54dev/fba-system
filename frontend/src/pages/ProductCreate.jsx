import React, { useState } from 'react';
import { createProduct } from '../api';
import { useNavigate } from 'react-router-dom';

const ProductCreate = () => {
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [referenceLink1, setReferenceLink1] = useState('');
  const [referenceLink2, setReferenceLink2] = useState('');
  const [referenceLink3, setReferenceLink3] = useState('');
  const [reason, setReason] = useState('');
  const [differentiation, setDifferentiation] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setError('请上传图片');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('reference_link_1', referenceLink1);
    if (referenceLink2) formData.append('reference_link_2', referenceLink2);
    if (referenceLink3) formData.append('reference_link_3', referenceLink3);
    formData.append('reason', reason);
    formData.append('differentiation', differentiation);

    try {
      await createProduct(formData);
      navigate('/products');
    } catch (err) {
      console.error(err);
      setError('提交失败，请检查输入内容');
    }
  };

  return (
    <div>
      <h2>添加产品</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>

        <div>
          <label>图片（必填）</label><br />
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        </div>

        <div>
          <label>参考链接 1（必填）</label><br />
          <input type="text" value={referenceLink1} onChange={(e) => setReferenceLink1(e.target.value)} required />
        </div>

        <div>
          <label>参考链接 2（可选）</label><br />
          <input type="text" value={referenceLink2} onChange={(e) => setReferenceLink2(e.target.value)} />
        </div>

        <div>
          <label>参考链接 3（可选）</label><br />
          <input type="text" value={referenceLink3} onChange={(e) => setReferenceLink3(e.target.value)} />
        </div>

        <div>
          <label>开发理由</label><br />
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} required />
        </div>

        <div>
          <label>差异化</label><br />
          <textarea value={differentiation} onChange={(e) => setDifferentiation(e.target.value)} required />
        </div>

        <button type="submit">提交</button>
      </form>
    </div>
  );
};

export default ProductCreate;
