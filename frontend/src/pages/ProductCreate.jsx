import React, { useState } from 'react';
import { createProduct } from '../api';
import { useNavigate } from 'react-router-dom';

function ProductCreate() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [reference1, setReference1] = useState('');
  const [reference2, setReference2] = useState('');
  const [reference3, setReference3] = useState('');
  const [reason, setReason] = useState('');
  const [differentiation, setDifferentiation] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!image || !reference1 || !reason || !differentiation) {
      setError('图片、参考链接1、开发理由、差异化为必填');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('reference_link_1', reference1);
    if (reference2) formData.append('reference_link_2', reference2);
    if (reference3) formData.append('reference_link_3', reference3);
    formData.append('reason', reason);
    formData.append('differentiation', differentiation);

    setSaving(true);
    try {
      await createProduct(formData);
      navigate('/products');
    } catch (err) {
      console.error(err);
      setError('提交失败，请检查后端日志');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>添加产品</h2>

      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: '600px', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}
      >
        {error && <div style={{ color: 'red' }}>{error}</div>}

        <div>
          <label>图片（必填）</label>
          <br />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0] || null)}
          />
        </div>

        <div>
          <label>参考链接 1（必填）</label>
          <br />
          <input
            type="text"
            value={reference1}
            onChange={(e) => setReference1(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div>
          <label>参考链接 2（选填）</label>
          <br />
          <input
            type="text"
            value={reference2}
            onChange={(e) => setReference2(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div>
          <label>参考链接 3（选填）</label>
          <br />
          <input
            type="text"
            value={reference3}
            onChange={(e) => setReference3(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div>
          <label>开发理由（必填）</label>
          <br />
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div>
          <label>差异化（必填，包含定价、配置等）</label>
          <br />
          <textarea
            value={differentiation}
            onChange={(e) => setDifferentiation(e.target.value)}
            rows={4}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginTop: '12px' }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: '8px 12px',
              borderRadius: '4px',
              border: 'none',
              background: '#2563eb',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            {saving ? '提交中...' : '提交'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/products')}
            style={{
              marginLeft: '8px',
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              background: '#fff',
              cursor: 'pointer'
            }}
          >
            取消
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductCreate;

