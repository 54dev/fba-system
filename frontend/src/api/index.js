// ======================
// API 基础路径
// ======================
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost/api";


// ======================
// 通用请求封装
// ======================
async function request(url, options = {}) {
  const token = localStorage.getItem("token");

  const headers = options.headers || {};

  // 若 body 不是 FormData，则自动加 JSON 头
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }

  return res.json();
}


// ======================
// 登录
// ======================
export function login(email, password) {
  return request("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}


// ======================
// 获取当前登录用户
// ======================
export function fetchMe() {
  return request("/me");
}


// ======================
// Dashboard 统计信息
// ======================
export function fetchDashboardStats() {
  return request("/dashboard");
}


// ======================
// 获取产品列表
// ======================
export function fetchProducts() {
  return request("/products");
}


// ======================
// 创建新产品（含图片上传）
// ======================
export function createProduct(formData) {
  const token = localStorage.getItem("token");

  return fetch(`${API_BASE}/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  }).then((res) => {
    if (!res.ok) throw new Error("Upload failed");
    return res.json();
  });
}


// ======================
// 更新审核结果
// ======================
export function updateProductReview(productId, data) {
  return request(`/products/${productId}/review`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}


// ======================
// 审核记录
// ======================
export function fetchReviews() {
  return request("/reviews");
}


// ======================
// 登录日志
// ======================
export function fetchLoginLogs() {
  return request("/login-logs");
}


// ======================
// 用户管理
// ======================
export function fetchUsers() {
  return request("/users");
}

export function createUser(data) {
  return request("/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
}


// ======================
// 退出登录（新增）
// ======================
export function logout() {
  return request("/logout", {
    method: "POST",
  });
}
