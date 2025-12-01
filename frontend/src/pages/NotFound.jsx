import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div>
      <h1>页面不存在</h1>
      <p>你访问的页面不存在。</p>
      <Link to="/">返回首页</Link>
    </div>
  )
}
