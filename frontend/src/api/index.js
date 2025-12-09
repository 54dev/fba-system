// src/api/index.js

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost/api";

// 通用请求封装（JSON 请求）
async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = options.headers ? { ...options.headers } : {};

  // 非 FormData 才加 JSON 头
  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let message = `API Error: ${res.status}`;
    try {
      const data = await res.json();
      if (data && data.message) {
        message = data.message;
      }
    } catch (e) {
      // 忽略解析错误
    }
    throw new Error(message);
  }

  if (res.status === 204) return null;
  return res.json();
}

// =================== 认证相关 ===================

// 登录：返回 { token, user }
export function login(email, password) {
  return request("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// 获取当前用户信息
export function fetchMe() {
  return request("/me");
}

// 退出登录
export function logout() {
  return request("/logout", {
    method: "POST",
  });
}

// =================== Dashboard ===================

export function fetchDashboardStats() {
  return request("/dashboard");
}

// =================== 产品相关 ===================

// 产品列表
export function fetchProducts() {
  return request("/products");
}

// 新建产品（带图片）
export function createProduct(formData) {
  const token = localStorage.getItem("token");
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(`${API_BASE}/products`, {
    method: "POST",
    headers,
    body: formData,
  }).then(async (res) => {
    if (!res.ok) {
      let message = `API Error: ${res.status}`;
      try {
        const data = await res.json();
        if (data && data.message) {
          message = data.message;
        }
      } catch (e) {}
      throw new Error(message);
    }
    return res.json();
  });
}

// 产品详情
export function getProductDetail(id) {
  return request(`/products/${id}`);
}

// 更新产品基础信息（图片/链接/文案等）
// 后端路由对应：POST /api/products/{product}
export function updateProduct(id, formData) {
  const token = localStorage.getItem("token");
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(`${API_BASE}/products/${id}`, {
    method: "POST",
    headers,
    body: formData,
  }).then(async (res) => {
    if (!res.ok) {
      let message = `API Error: ${res.status}`;
      try {
        const data = await res.json();
        if (data && data.message) {
          message = data.message;
        }
      } catch (e) {}
      throw new Error(message);
    }
    return res.json();
  });
}

// 更新产品审核状态（通过/拒绝）
export function updateProductReview(productId, data) {
  return request(`/products/${productId}/review`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// =================== 审核记录 ===================

export function fetchReviews() {
  return request("/reviews");
}

// =================== 登录日志 ===================

export function fetchLoginLogs() {
  return request("/login-logs");
}

// =================== 用户管理 ===================

// 用户列表
export function fetchUsers() {
  return request("/users");
}

// 新建用户
export function createUser(data) {
  return request("/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// 用户详情
export function getUserDetail(id) {
  return request(`/users/${id}`);
}

// 更新用户
export function updateUser(id, data) {
  return request(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
