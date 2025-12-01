import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'

export default function ProductForm() {
  const [form, setForm] = useState({
    ref_link1: '',
    ref_link2: '',
    ref_link3: '',
    reason: '',
    differentiation: ''
  })
  const [image, setImage] = useState(null)
  const navigate = useNavigate()

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (!image) {
      alert('请上传图片')
      return
    }
    const fd = new FormData()
    fd.append('image', image)
    fd.append('ref_link1', form.ref_link1)
    if (form.ref_link2) fd.append('ref_link2', form.ref_link2)
    if (form.ref_link3) fd.append('ref_link3', form.ref_link3)
    fd.append('reason', form.reason)
    fd.append('differentiation', form.differentiation)

    api.post('/products', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(() => {
      alert('提交成功')
      navigate('/products')
    }).catch(err => {
      console.error(err)
      alert('提交失败')
    })
  }

  return (
    <div>
      <h1>添加产品</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>图片（必填）：</label>
          <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} />
        </div>
        <div>
          <label>参考链接1（必填）：</label>
          <input name="ref_link1" value={form.ref_link1} onChange={handleChange} />
        </div>
        <div>
          <label>参考链接2（选填）：</label>
          <input name="ref_link2" value={form.ref_link2} onChange={handleChange} />
        </div>
        <div>
          <label>参考链接3（选填）：</label>
          <input name="ref_link3" value={form.ref_link3} onChange={handleChange} />
        </div>
        <div>
          <label>开发理由（必填）：</label><br />
          <textarea name="reason" value={form.reason} onChange={handleChange} rows={4} cols={60} />
        </div>
        <div>
          <label>差异化（必填，含定价/配置）：</label><br />
          <textarea name="differentiation" value={form.differentiation} onChange={handleChange} rows={4} cols={60} />
        </div>
        <button type="submit">提交</button>
      </form>
    </div>
  )
}
