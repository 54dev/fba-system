import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>验证登录中...</div>
  }

  const token = localStorage.getItem('token')
  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  return children
}
