import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';

function Login({ onLogin }) {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      // 预期 data: { token, user }
      if (data.token && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.user);
        navigate('/dashboard');
      } else {
        setError('登录响应异常，请检查后端返回结构');
      }
    } catch (err) {
      console.error(err);
      setError('登录失败，请检查账号或密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f3f4f6'
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: '#fff',
          padding: '24px',
          borderRadius: '8px',
          width: '320px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
        }}
      >
        <h2 style={{ marginBottom: '16px', textAlign: 'center' }}>登录</h2>

        <div style={{ marginBottom: '12px' }}>
          <label>邮箱</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>密码</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>

        {error && (
          <div style={{ color: 'red', marginBottom: '8px', fontSize: '14px' }}>{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            marginTop: '8px',
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {loading ? '登录中...' : '登录'}
        </button>
      </form>
    </div>
  );
}

export default Login;

