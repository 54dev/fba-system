import React, { useEffect, useState } from 'react'
import { api } from '../api'

export default function Reviews() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/reviews')
      .then(res => setRows(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>审核记录</h1>
      {loading ? (
        <div>加载中...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ background: '#fff', borderCollapse: 'collapse', width: '100%', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#e5e7eb' }}>
                <th style={{ padding: 8, border: '1px solid #d1d5db' }}>ID</th>
                <th style={{ padding: 8, border: '1px solid #d1d5db' }}>日期</th>
                <th style={{ padding: 8, border: '1px solid #d1d5db' }}>产品ID</th>
                <th style={{ padding: 8, border: '1px solid #d1d5db' }}>审核员</th>
                <th style={{ padding: 8, border: '1px solid #d1d5db' }}>审核结果</th>
                <th style={{ padding: 8, border: '1px solid #d1d5db' }}>备注</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td style={{ padding: 8, border: '1px solid #e5e7eb' }}>{r.id}</td>
                  <td style={{ padding: 8, border: '1px solid #e5e7eb' }}>{r.date}</td>
                  <td style={{ padding: 8, border: '1px solid #e5e7eb' }}>{r.product_id}</td>
                  <td style={{ padding: 8, border: '1px solid #e5e7eb' }}>{r.reviewer}</td>
                  <td style={{ padding: 8, border: '1px solid #e5e7eb' }}>{r.result}</td>
                  <td style={{ padding: 8, border: '1px solid #e5e7eb', whiteSpace: 'pre-wrap' }}>{r.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
