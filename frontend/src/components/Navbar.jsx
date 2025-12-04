import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../api';

function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      // 即使后端报错，前端也直接清理本地状态
      console.error(e);
    } finally {
      navigate('/login');
    }
  };

  if (!user) return null;

  const role = user.role;

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 20px',
        background: '#1f2933',
        color: '#fff'
      }}
    >
      <div style={{ fontWeight: 'bold' }}>FBA 产品管理系统</div>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Link to="/dashboard" style={{ color: '#fff', textDecoration: 'none' }}>
          主页
        </Link>

        <Link to="/products" style={{ color: '#fff', textDecoration: 'none' }}>
          产品列表
        </Link>

        {(role === 'admin' || role === 'reviewer') && (
          <Link to="/reviews" style={{ color: '#fff', textDecoration: 'none' }}>
            审核记录
          </Link>
        )}

        {role === 'admin' && (
          <Link to="/login-logs" style={{ color: '#fff', textDecoration: 'none' }}>
            登陆日志
          </Link>
        )}

        <span style={{ marginLeft: '16px', opacity: 0.8 }}>当前用户：{user.name}（{role}）</span>

        <button
          onClick={handleLogout}
          style={{
            marginLeft: '16px',
            padding: '6px 10px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          退出
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

