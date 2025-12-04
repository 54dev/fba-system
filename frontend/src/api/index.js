const API_BASE = "http://localhost/api";

// 统一封装请求
async function request(url, options = {}) {
  const token = localStorage.getItem("token");

  const headers = options.headers || {};
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

// 登录
export function login(email, password) {
  return request("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// ========== 退出登录 ==========
export function logout() {
  const token = localStorage.getItem("token");

  return fetch(`${API_BASE}/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).finally(() => {
    localStorage.removeItem("token");
  });
}


// 获取当前用户
export function fetchMe() {
  return request("/me");
}

// Dashboard 统计
export function fetchDashboardStats() {
  return request("/dashboard");
}

// 产品列表
export function fetchProducts() {
  return request("/products");
}

// 添加产品（文件上传）
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

// 更新审核
export function updateProductReview(productId, data) {
  return request(`/products/${productId}/review`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// 审核记录
export function fetchReviews() {
  return request("/reviews");
}

// 登录日志
export function fetchLoginLogs() {
  return request("/login-logs");
}

// 用户列表
export function fetchUsers() {
  return request("/users");
}

// 创建用户
export function createUser(data) {
  return request("/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
