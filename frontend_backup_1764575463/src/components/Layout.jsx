import React from 'react'
import { Link } from 'react-router-dom'

export default function Layout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <aside style={{ width: 220, background: '#20232a', color: '#fff', padding: 16 }}>
        <h2 style={{ fontSize: 20, marginBottom: 24 }}>FBA 管理</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Link to="/" style={{ color: '#fff' }}>主页</Link>
          <Link to="/products" style={{ color: '#fff' }}>产品列表</Link>
          <Link to="/reviews" style={{ color: '#fff' }}>审核记录</Link>
          <Link to="/login-logs" style={{ color: '#fff' }}>登陆日志</Link>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: 24, background: '#f5f5f5' }}>
        {children}
      </main>
    </div>
  )
}
