import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import ProductCreate from './pages/ProductCreate';
import ReviewList from './pages/ReviewList';
import LoginLog from './pages/LoginLog';
import UserPage from './pages/UserPage';

// 布局组件
function Layout({ children }) {
  return (
    <div style={{ display: 'flex' }}>
      <nav style={{ width: '200px', padding: '20px' }}>
        <ul>
          <li><Link to="/dashboard">主页</Link></li>
          <li><Link to="/products">产品列表</Link></li>
          <li><Link to="/products/create">添加产品</Link></li>
          <li><Link to="/reviews">审核记录</Link></li>
          <li><Link to="/login-logs">登录日志</Link></li>
          <li><Link to="/users">用户管理</Link></li>
        </ul>
      </nav>

      <main style={{ padding: '20px', flexGrow: 1 }}>
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />

      <Route path="/products" element={<Layout><ProductList /></Layout>} />

      <Route path="/products/create" element={<Layout><ProductCreate /></Layout>} />

      <Route path="/reviews" element={<Layout><ReviewList /></Layout>} />

      <Route path="/login-logs" element={<Layout><LoginLog /></Layout>} />

      <Route path="/users" element={<Layout><UserPage /></Layout>} />
    </Routes>
  );
}
