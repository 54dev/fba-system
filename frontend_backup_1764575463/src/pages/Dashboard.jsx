import React, { useEffect, useState } from 'react'
import { api } from '../api'

export default function Dashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.get('/dashboard').then(res => setStats(res.data)).catch(console.error)
  }, [])

  if (!stats) return <div>加载中...</div>

  const cardStyle = {
    background: '#fff',
    padding: 16,
    borderRadius: 8,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    flex: 1
  }

  return (
    <div>
      <h1>主页</h1>
      <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
        <div style={cardStyle}>操作员人数：{stats.operator_count}</div>
        <div style={cardStyle}>审核员人数：{stats.reviewer_count}</div>
        <div style={cardStyle}>提交产品数量：{stats.product_count}</div>
        <div style={cardStyle}>审核通过：{stats.approved_count}</div>
        <div style={cardStyle}>未通过：{stats.rejected_count}</div>
      </div>
    </div>
  )
}
