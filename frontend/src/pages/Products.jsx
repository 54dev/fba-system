import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../AuthContext'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  const canReview = user && (user.role === 'admin' || user.role === 'reviewer')

  const load = () => {
    setLoading(true)
    api.get('/products')
      .then(res => setProducts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleReviewChange = async (productId, currentStatus) => {
    const result = window.prompt('请输入审核结果：approved / rejected', currentStatus || 'approved')
    if (!result || (result !== 'approved' && result !== 'rejected')) return
    setUpdatingId(productId)
    try {
      await api.put(`/products/${productId}/review`, { result })
      load()
    } catch (err) {
      console.error(err)
      alert('更新失败')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>产品列表</h1>
      <div style={{ marginBottom: 16 }}>
        <button
          onClick={() => navigate('/products/new')}
          style={{
            padding: '6px 12px',
            borderRadius: 6,
            border: 'none',
            background: '#22c55e',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          添加产品
        </button>
      </div>
      {loading ? (
        <div>加载中...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ background: '#fff', borderCollapse: 'collapse', width: '100%', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#e5e7eb' }}>
                <th style={{ padding: 8, border: '1px solid #d1d5db' }}>ID</th>
                <th style={{ padding: 8, border: '1px solid #d1d5db' }}>日期</th>
                <th style={{ padding: 8, border: '1px solid #d1d5db' }}>图片</th>
                <th style={{ padding: 8, border: '1px solid #d1d5db' }}>参考链接1</th>
                <th style={{ padding: 8, border: '1px solid #d1d5db' }}>参考链接2</th>
                <th style={{ padding: 8, border: '1px solid #d1d5db' }}>参考链接3</th>
                <th style={{ padding: 8, border: '1px solid #d1d5db', minWidth: 150 }}>开发理由</th>
                <th style={{ padding: 8, border: '1px solid #d1d5db', minWidth: 150 }}>差异化</th>
                <th style={{ padding: 8, border: '1px solid #d1d5db' }}>操作员</th>
                <th style={{ padding: 8, border: '1px solid #d1d5db' }}>审核结果</th>
                {canReview && <th style={{ padding: 8, border: '1px solid #d1d5db' }}>操作</th>}
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td style={{ padding: 8, border: '1px solid #e5e7eb' }}>{p.id}</td>
                  <td style={{ padding: 8, border: '1px solid #e5e7eb' }}>{p.date}</td>
                  <td style={{ padding: 8, border: '1px solid #e5e7eb' }}>
                    {p.image_url && (
                      <img
                        src={p.image_url}
                        alt=""
                        style={{ maxWidth: 80, borderRadius: 6, display: 'block' }}
                      />
                    )}
                  </td>
                  <td style={{ padding: 8, border: '1px solid #e5e7eb' }}>
                    {p.ref_link1 && <a href={p.ref_link1} target="_blank" rel="noreferrer">链接1</a>}
                  </td>
                  <td style={{ padding: 8, border: '1px solid #e5e7eb' }}>
                    {p.ref_link2 && <a href={p.ref_link2} target="_blank" rel="noreferrer">链接2</a>}
                  </td>
                  <td style={{ padding: 8, border: '1px solid #e5e7eb' }}>
                    {p.ref_link3 && <a href={p.ref_link3} target="_blank" rel="noreferrer">链接3</a>}
                  </td>
                  <td style={{ padding: 8, border: '1px solid #e5e7eb', whiteSpace: 'pre-wrap' }}>{p.reason}</td>
                  <td style={{ padding: 8, border: '1px solid #e5e7eb', whiteSpace: 'pre-wrap' }}>{p.differentiation}</td>
                  <td style={{ padding: 8, border: '1px solid #e5e7eb' }}>{p.operator_name}</td>
                  <td style={{ padding: 8, border: '1px solid #e5e7eb' }}>{p.review_status}</td>
                  {canReview && (
                    <td style={{ padding: 8, border: '1px solid #e5e7eb' }}>
                      <button
                        disabled={updatingId === p.id}
                        onClick={() => handleReviewChange(p.id, p.review_status)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: 4,
                          border: 'none',
                          background: '#3b82f6',
                          color: '#fff',
                          cursor: 'pointer',
                          fontSize: 12,
                        }}
                      >
                        {updatingId === p.id ? '更新中...' : '修改审核'}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
