const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost/api";

// 统一封装请求，支持 JSON / FormData，并返回可读错误
async function request(path, options = {}) {
  const token = localStorage.getItem("token");

  const {
    method = "GET",
    body = undefined,
    headers: customHeaders = {},
  } = options;

  const headers = { ...customHeaders };

  // FormData 不能手动设置 Content-Type
  const isFormData = body instanceof FormData;
  if (!isFormData) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body,
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (_) {
    data = text;
  }

  if (!res.ok) {
    const message =
      (data && data.message) ||
      (typeof data === "string" && data) ||
      `API Error: ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

/* ============ 认证相关 ============ */

export function login(email, password) {
  return request("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// ✅ 新增：与 App.jsx 对齐的 me()
export function me() {
  return fetchMe();
}

export function fetchMe() {
  return request("/me");
}

export function logout() {
  return request("/logout", { method: "POST" });
}

/* ============ Dashboard ============ */

export function fetchDashboard() {
  return request("/dashboard");
}

/* ============ 产品相关 ============ */

export function fetchProducts() {
  return request("/products");
}

export function createProduct(formData) {
  return request("/products", {
    method: "POST",
    body: formData,
  });
}

export function updateProduct(productId, formData) {
  if (!(formData instanceof FormData)) {
    const fd = new FormData();
    Object.entries(formData || {}).forEach(([k, v]) =>
      fd.append(k, v == null ? "" : v)
    );
    formData = fd;
  }
  formData.append("_method", "PUT");

  return request(`/products/${productId}`, {
    method: "POST",
    body: formData,
  });
}

export function getProductDetail(productId) {
  return request(`/products/${productId}`);
}

// 审核产品
export function updateProductReview(productId, data) {
  return request(`/products/${productId}/review`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/* ============ 审核记录 ============ */

export function fetchReviews() {
  return request("/reviews");
}

/* ============ 登录日志 ============ */

export function fetchLoginLogs() {
  return request("/login-logs");
}

/* ============ 用户管理 ============ */

export function fetchUsers() {
  return request("/users");
}

export function createUser(data) {
  return request("/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getUserDetail(userId) {
  return request(`/users/${userId}`);
}

export function updateUser(userId, data) {
  return request(`/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
