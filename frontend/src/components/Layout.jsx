import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  padding: '8px 12px',
  borderRadius: 6,
}

const activeStyle = {
  background: '#3b82f6',
}

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const role = user?.role

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <aside style={{ width: 240, background: '#111827', color: '#e5e7eb', padding: 16, boxSizing: 'border-box' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 20, fontWeight: 600 }}>FBA 管理系统</div>
          {user && (
            <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
              {user.name}（{user.role}）
            </div>
          )}
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Link to="/" style={{ ...linkStyle, ...(isActive('/') ? activeStyle : {}) }}>主页</Link>
          <Link to="/products" style={{ ...linkStyle, ...(isActive('/products') ? activeStyle : {}) }}>产品列表</Link>
          {(role === 'reviewer' || role === 'admin') && (
            <Link to="/reviews" style={{ ...linkStyle, ...(isActive('/reviews') ? activeStyle : {}) }}>审核记录</Link>
          )}
          {role === 'admin' && (
            <Link to="/login-logs" style={{ ...linkStyle, ...(isActive('/login-logs') ? activeStyle : {}) }}>登陆日志</Link>
          )}
        </nav>
        <div style={{ marginTop: 'auto' }}>
          {user && (
            <button
              onClick={handleLogout}
              style={{
                marginTop: 24,
                width: '100%',
                padding: '8px 12px',
                borderRadius: 6,
                border: 'none',
                background: '#ef4444',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              退出登录
            </button>
          )}
        </div>
      </aside>
      <main style={{ flex: 1, background: '#f3f4f6', padding: 24, boxSizing: 'border-box' }}>
        {children}
      </main>
    </div>
  )
}
