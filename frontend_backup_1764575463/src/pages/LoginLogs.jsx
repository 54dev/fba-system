import React, { useEffect, useState } from 'react'
import { api } from '../api'

export default function LoginLogs() {
  const [logs, setLogs] = useState([])

  useEffect(() => {
    api.get('/login-logs').then(res => setLogs(res.data)).catch(console.error)
  }, [])

  return (
    <div>
      <h1>登陆日志（仅管理员可见）</h1>
      <table border="1" cellPadding="6" style={{ background: '#fff', borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>人员名称</th>
            <th>登陆时间</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(l => (
            <tr key={l.id}>
              <td>{l.id}</td>
              <td>{l.user}</td>
              <td>{l.login_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
