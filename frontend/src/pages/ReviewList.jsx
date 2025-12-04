import React, { useEffect, useState } from 'react';
import { fetchReviews } from '../api';

function ReviewList() {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const data = await fetchReviews();
      setReviews(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error(err);
      setError('加载审核记录失败');
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>审核记录</h2>

      {error && <div style={{ color: 'red', marginTop: '8px' }}>{error}</div>}

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px', fontSize: '14px' }}>
        <thead>
          <tr>
            <th>日期</th>
            <th>产品 ID</th>
            <th>审核员</th>
            <th>审核结果</th>
            <th>备注</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((r) => (
            <tr key={r.id}>
              <td>{r.created_at}</td>
              <td>{r.product_id}</td>
              <td>{r.reviewer?.name ?? '-'}</td>
              <td>{r.result ?? r.review_result ?? '-'}</td>
              <td style={{ maxWidth: '260px', whiteSpace: 'pre-wrap' }}>{r.comment ?? '-'}</td>
            </tr>
          ))}
          {reviews.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                暂无审核记录
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ReviewList;

