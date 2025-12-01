import React, { useEffect, useState } from 'react'
import { api } from '../api'

export default function LoginLogs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/login-logs')
      .then(res => setLogs(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>登陆日志（仅管理员可见）</h1>
      {loading ? (
        <div>加载中...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ background: '#fff', borderCollapse: 'collapse', width: '100%', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#e5e7eb' }}>
                <th style={{ padding: 8, border: '1px solid #d1d5db' }}>ID</th>
                <th style={{ padding: 8, border: '1px solid #d1d5db' }}>人员名称</th>
                <th style={{ padding: 8, border: '1px solid #d1d5db' }}>登陆时间</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(l => (
                <tr key={l.id}>
                  <td style={{ padding: 8, border: '1px solid #e5e7eb' }}>{l.id}</td>
                  <td style={{ padding: 8, border: '1px solid #e5e7eb' }}>{l.user}</td>
                  <td style={{ padding: 8, border: '1px solid #e5e7eb' }}>{l.login_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
