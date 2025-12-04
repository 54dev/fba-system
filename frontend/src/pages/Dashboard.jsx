import React, { useEffect, useState } from 'react';
import { fetchDashboardStats } from '../api';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (err) {
        console.error(err);
        setError('无法加载统计信息');
      }
    };
    load();
  }, []);

  if (error) {
    return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;
  }

  if (!stats) {
    return <div style={{ padding: '20px' }}>加载中...</div>;
  }

  const {
    total_products,
    total_reviews,
    total_users,
    recent_logins = []
  } = stats;

  return (
    <div style={{ padding: '20px' }}>
      <h2>主页统计</h2>

      <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
        <div style={cardStyle}>
          <div>产品数量</div>
          <strong>{total_products ?? 0}</strong>
        </div>
        <div style={cardStyle}>
          <div>审核记录数</div>
          <strong>{total_reviews ?? 0}</strong>
        </div>
        <div style={cardStyle}>
          <div>用户总数</div>
          <strong>{total_users ?? 0}</strong>
        </div>
      </div>

      <h3 style={{ marginTop: '24px' }}>最近登陆</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th>用户</th>
            <th>角色</th>
            <th>登陆时间</th>
          </tr>
        </thead>
        <tbody>
          {recent_logins.map((log) => (
            <tr key={log.id}>
              <td>{log.user?.name ?? '-'}</td>
              <td>{log.user?.role ?? '-'}</td>
              <td>{log.logged_in_at ?? '-'}</td>
            </tr>
          ))}
          {recent_logins.length === 0 && (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center' }}>
                暂无登陆记录
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const cardStyle = {
  padding: '12px 16px',
  borderRadius: '8px',
  background: '#f9fafb',
  minWidth: '160px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '8px'
};

export default Dashboard;

