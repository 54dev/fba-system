import React, { useEffect, useState } from 'react';
import { fetchLoginLogs } from '../api';

const LoginLogPage = () => {
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
    <div>
      <h2>登录日志</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>用户</th>
            <th>邮箱</th>
            <th>登录时间</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{log.user?.name}</td>
              <td>{log.user?.email}</td>
              <td>{new Date(log.logged_in_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoginLogPage;
