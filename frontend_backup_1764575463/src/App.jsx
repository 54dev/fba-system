import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import ProductForm from './pages/ProductForm'
import Reviews from './pages/Reviews'
import LoginLogs from './pages/LoginLogs'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/new" element={<ProductForm />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/login-logs" element={<LoginLogs />} />
      </Routes>
    </Layout>
  )
}
