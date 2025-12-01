import React, { useEffect, useState } from 'react'
import { api } from '../api'

export default function Reviews() {
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    api.get('/reviews').then(res => setReviews(res.data)).catch(console.error)
  }, [])

  return (
    <div>
      <h1>审核记录</h1>
      <table border="1" cellPadding="6" style={{ background: '#fff', borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>日期</th>
            <th>产品ID</th>
            <th>审核员</th>
            <th>审核结果</th>
            <th>备注</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.date}</td>
              <td>{r.product_id}</td>
              <td>{r.reviewer}</td>
              <td>{r.result}</td>
              <td>{r.comment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
