import React, { useEffect, useState } from 'react';
import { fetchLoginLogs } from '../api';

function LoginLog() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const data = await fetchLoginLogs();
      setLogs(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error(err);
      setError('加载登陆日志失败');
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>登陆日志</h2>

      {error && <div style={{ color: 'red', marginTop: '8px' }}>{error}</div>}

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px', fontSize: '14px' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>用户</th>
            <th>角色</th>
            <th>登陆时间</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{log.id}</td>
              <td>{log.user?.name ?? '-'}</td>
              <td>{log.user?.role ?? '-'}</td>
              <td>{log.logged_in_at ?? '-'}</td>
            </tr>
          ))}
          {logs.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                暂无登陆日志
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default LoginLog;

