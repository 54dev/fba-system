import React, { useEffect, useState } from 'react';
import { fetchProducts, updateProductReview } from '../api';
import { Link, useNavigate } from 'react-router-dom';

function ProductList({ user }) {
  const [products, setProducts] = useState([]);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const role = user?.role;

  const load = async () => {
    try {
      const data = await fetchProducts();
      // 预期 data 是数组，如果后端返回 {data: []}，可以改成 data.data
      setProducts(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error(err);
      setError('加载产品列表失败');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleReviewChange = async (productId, value) => {
    if (role !== 'admin' && role !== 'reviewer') return;

    setSavingId(productId);
    try {
      await updateProductReview(productId, value);
      await load();
    } catch (err) {
      console.error(err);
      alert('更新审核结果失败');
    } finally {
      setSavingId(null);
    }
  };

  const formatLink = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return 'https://' + url;
  };

  return (
    <div style={{ padding: '20px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '16px',
          alignItems: 'center'
        }}
      >
        <h2>产品列表</h2>
        <button
          onClick={() => navigate('/products/create')}
          style={{
            padding: '8px 12px',
            borderRadius: '4px',
            border: 'none',
            background: '#16a34a',
            color: '#fff',
            cursor: 'pointer'
          }}
        >
          添加产品
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '8px' }}>{error}</div>}

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        <thead>
          <tr>
            <th>日期</th>
            <th>图片</th>
            <th>参考链接</th>
            <th>开发理由</th>
            <th>差异化</th>
            <th>操作员</th>
            <th>审核结果</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.created_at}</td>
              <td>
                {p.image_path && (
                  <img
                    src={formatLink(p.image_url || p.image_path)}
                    alt=""
                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                  />
                )}
              </td>
              <td>
                {p.reference_link_1 && (
                  <div>
                    <a href={formatLink(p.reference_link_1)} target="_blank" rel="noreferrer">
                      链接1
                    </a>
                  </div>
                )}
                {p.reference_link_2 && (
                  <div>
                    <a href={formatLink(p.reference_link_2)} target="_blank" rel="noreferrer">
                      链接2
                    </a>
                  </div>
                )}
                {p.reference_link_3 && (
                  <div>
                    <a href={formatLink(p.reference_link_3)} target="_blank" rel="noreferrer">
                      链接3
                    </a>
                  </div>
                )}
              </td>
              <td style={{ maxWidth: '220px', whiteSpace: 'pre-wrap' }}>{p.reason}</td>
              <td style={{ maxWidth: '220px', whiteSpace: 'pre-wrap' }}>{p.differentiation}</td>
              <td>{p.user?.name ?? '-'}</td>
              <td>
                {role === 'admin' || role === 'reviewer' ? (
                  <select
                    value={p.review_result || 'pending'}
                    disabled={savingId === p.id}
                    onChange={(e) => handleReviewChange(p.id, e.target.value)}
                  >
                    <option value="pending">待审核</option>
                    <option value="approved">通过</option>
                    <option value="rejected">不通过</option>
                  </select>
                ) : (
                  p.review_result || 'pending'
                )}
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                暂无产品
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProductList;

