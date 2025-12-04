import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import ProductCreate from './pages/ProductCreate';
import ReviewList from './pages/ReviewList';
import LoginLog from './pages/LoginLog';
import { fetchMe } from './api';

function ProtectedRoute({ children, user }) {
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function RoleRoute({ children, user, allow }) {
  if (!user) return <Navigate to="/login" replace />;
  if (!allow.includes(user.role)) {
    return <div style={{ padding: '20px', color: 'red' }}>无访问权限</div>;
  }
  return children;
}

function App() {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setChecking(false);
        return;
      }
      try {
        const me = await fetchMe();
        setUser(me);
        localStorage.setItem('user', JSON.stringify(me));
      } catch (err) {
        console.error('fetchMe failed', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setChecking(false);
      }
    };
    check();
  }, []);

  if (checking) {
    return <div style={{ padding: '20px' }}>加载中...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      <Navbar user={user} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', background: '#fff', minHeight: 'calc(100vh - 56px)' }}>
        <Routes>
          <Route path="/login" element={<Login onLogin={setUser} />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute user={user}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products"
            element={
              <ProtectedRoute user={user}>
                <ProductList user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products/create"
            element={
              <ProtectedRoute user={user}>
                <ProductCreate />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reviews"
            element={
              <RoleRoute user={user} allow={['admin', 'reviewer']}>
                <ReviewList />
              </RoleRoute>
            }
          />

          <Route
            path="/login-logs"
            element={
              <RoleRoute user={user} allow={['admin']}>
                <LoginLog />
              </RoleRoute>
            }
          />

          <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
          <Route path="*" element={<div style={{ padding: '20px' }}>页面不存在</div>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

