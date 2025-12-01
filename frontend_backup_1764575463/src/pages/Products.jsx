import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'

export default function Products() {
  const [products, setProducts] = useState([])
  const [me, setMe] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      api.get('/me'),
      api.get('/products')
    ]).then(([meRes, pRes]) => {
      setMe(meRes.data)
      setProducts(pRes.data)
    }).catch(console.error)
  }, [])

  const handleReviewChange = (productId, currentStatus) => {
    const result = window.prompt('请输入审核结果 approved / rejected', currentStatus)
    if (!result || (result !== 'approved' && result !== 'rejected')) return
    api.put(`/products/${productId}/review`, { result })
      .then(() => api.get('/products'))
      .then(res => setProducts(res.data))
      .catch(err => {
        console.error(err)
        alert('更新失败')
      })
  }

  const canReview = me && (me.role === 'admin' || me.role === 'reviewer')

  return (
    <div>
      <h1>产品列表</h1>
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => navigate('/products/new')}>添加产品</button>
      </div>
      <table border="1" cellPadding="6" style={{ background: '#fff', borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>日期</th>
            <th>图片</th>
            <th>参考链接1</th>
            <th>参考链接2</th>
            <th>参考链接3</th>
            <th>开发理由</th>
            <th>差异化</th>
            <th>操作员</th>
            <th>审核结果</th>
            {canReview && <th>操作</th>}
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.date}</td>
              <td>
                {p.image_url && <img src={p.image_url} alt="" style={{ maxWidth: 80 }} />}
              </td>
              <td>{p.ref_link1 && <a href={p.ref_link1} target="_blank" rel="noreferrer">链接1</a>}</td>
              <td>{p.ref_link2 && <a href={p.ref_link2} target="_blank" rel="noreferrer">链接2</a>}</td>
              <td>{p.ref_link3 && <a href={p.ref_link3} target="_blank" rel="noreferrer">链接3</a>}</td>
              <td>{p.reason}</td>
              <td>{p.differentiation}</td>
              <td>{p.operator_name}</td>
              <td>{p.review_status}</td>
              {canReview && (
                <td>
                  <button onClick={() => handleReviewChange(p.id, p.review_status)}>修改审核</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
