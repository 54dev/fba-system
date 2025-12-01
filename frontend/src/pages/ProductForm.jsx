import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'

export default function ProductForm() {
  const [form, setForm] = useState({
    ref_link1: '',
    ref_link2: '',
    ref_link3: '',
    reason: '',
    differentiation: '',
  })
  const [image, setImage] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!image) {
      alert('请上传图片')
      return
    }
    if (!form.ref_link1 || !form.reason || !form.differentiation) {
      alert('请填写所有必填字段')
      return
    }
    const fd = new FormData()
    fd.append('image', image)
    fd.append('ref_link1', form.ref_link1)
    if (form.ref_link2) fd.append('ref_link2', form.ref_link2)
    if (form.ref_link3) fd.append('ref_link3', form.ref_link3)
    fd.append('reason', form.reason)
    fd.append('differentiation', form.differentiation)

    setSubmitting(true)
    try {
      await api.post('/products', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      alert('提交成功')
      navigate('/products')
    } catch (err) {
      console.error(err)
      alert('提交失败')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>添加产品</h1>
      <form onSubmit={handleSubmit} style={{
        background: '#fff',
        padding: 16,
        borderRadius: 10,
        maxWidth: 700,
      }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>图片（必填）：</label>
          <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>参考链接1（必填）：</label>
          <input
            name="ref_link1"
            value={form.ref_link1}
            onChange={handleChange}
            style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #d1d5db' }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>参考链接2（选填）：</label>
          <input
            name="ref_link2"
            value={form.ref_link2}
            onChange={handleChange}
            style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #d1d5db' }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>参考链接3（选填）：</label>
          <input
            name="ref_link3"
            value={form.ref_link3}
            onChange={handleChange}
            style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #d1d5db' }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>开发理由（必填）：</label>
          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            rows={4}
            style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #d1d5db' }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>差异化（必填，含定价/配置）：</label>
          <textarea
            name="differentiation"
            value={form.differentiation}
            onChange={handleChange}
            rows={4}
            style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #d1d5db' }}
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: '8px 14px',
            borderRadius: 6,
            border: 'none',
            background: submitting ? '#9ca3af' : '#2563eb',
            color: '#fff',
            cursor: submitting ? 'not-allowed' : 'pointer',
          }}
        >
          {submitting ? '提交中...' : '提交'}
        </button>
      </form>
    </div>
  )
}
