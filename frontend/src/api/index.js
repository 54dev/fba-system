// src/api/index.js

// 后端 API 根地址
// 优先使用环境变量，兼容你现在的 Docker + nginx 反向代理
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost/api";

/**
 * 通用请求封装
 * - 自动带上 Authorization 头
 * - 自动区分 JSON / FormData
 * - 尽量返回可读的错误信息（包含 Laravel 验证错误）
 */
async function request(path, options = {}) {
  const token = localStorage.getItem("token") || null;

  const headers = options.headers ? { ...options.headers } : {};

  // 不是 FormData 才加 JSON 头
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  // 204 No Content
  if (res.status === 204) {
    return null;
  }

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    // 不是 JSON，就保持 data = null
  }

  if (!res.ok) {
    // 尽量从返回体里拿到可读错误
    let msg = `API Error: ${res.status}`;

    if (data) {
      if (typeof data.message === "string" && data.message.trim() !== "") {
        msg = data.message;
      } else if (data.error) {
        msg = data.error;
      } else if (data.errors && typeof data.errors === "object") {
        // Laravel 验证错误 { field: [msg, ...], ... }
        const all = Object.values(data.errors)
          .flat()
          .filter(Boolean);
        if (all.length > 0) {
          msg = all.join("；");
        }
      }
    }

    throw new Error(msg);
  }

  return data;
}

/* =========================
 *  认证相关
 * =======================*/

// 登录
export function login(email, password) {
  return request("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// 获取当前登录用户信息
export function fetchMe() {
  return request("/me");
}

// 退出登录
export function logout() {
  return request("/logout", {
    method: "POST",
  });
}

/* =========================
 *  Dashboard / 首页统计
 * =======================*/

// 内部统一函数
export function getDashboardStats() {
  return request("/dashboard");
}

// 兼容旧命名：某些页面用的是 fetchDashboardStats
export function fetchDashboardStats() {
  return getDashboardStats();
}

/* =========================
 *  产品相关
 * =======================*/

// 获取产品列表
export function fetchProducts() {
  return request("/products");
}

// 创建产品（带图片上传）
export async function createProduct(formData) {
  // 这里不能用通用 request，因为要自己处理 FormData 和错误信息
  const token = localStorage.getItem("token") || null;
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}/products`, {
    method: "POST",
    headers,
    body: formData,
  });

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    // ignore
  }

  if (!res.ok) {
    let msg = "提交失败";

    if (data) {
      if (typeof data.message === "string" && data.message.trim() !== "") {
        msg = data.message;
      } else if (data.errors && typeof data.errors === "object") {
        const all = Object.values(data.errors)
          .flat()
          .filter(Boolean);
        if (all.length > 0) {
          msg = all.join("；");
        }
      }
    }

    throw new Error(msg);
  }

  return data;
}

// 更新产品（编辑：待审核 / 拒绝 状态下可编辑）
export async function updateProduct(productId, formData) {
  const token = localStorage.getItem("token") || null;
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}/products/${productId}`, {
    method: "POST", // 如果后端是 PUT，请改成 "PUT"
    headers,
    body: formData,
  });

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    // ignore
  }

  if (!res.ok) {
    let msg = "更新失败";

    if (data) {
      if (typeof data.message === "string" && data.message.trim() !== "") {
        msg = data.message;
      } else if (data.errors && typeof data.errors === "object") {
        const all = Object.values(data.errors)
          .flat()
          .filter(Boolean);
        if (all.length > 0) {
          msg = all.join("；");
        }
      }
    }

    throw new Error(msg);
  }

  return data;
}

// 获取产品详情（产品详情页 / 审核记录中点击产品 ID）
export function getProductDetail(productId) {
  return request(`/products/${productId}`);
}

// 兼容命名：如果某个组件 import { fetchProductDetail }
export function fetchProductDetail(productId) {
  return getProductDetail(productId);
}

// 更新产品审核（通过 / 拒绝，审核员 + 管理员）
export function updateProductReview(productId, data) {
  return request(`/products/${productId}/review`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/* =========================
 *  审核记录
 * =======================*/

// 审核记录列表
export function fetchReviews() {
  return request("/reviews");
}

/* =========================
 *  登录日志
 * =======================*/

// 登录日志
export function fetchLoginLogs() {
  return request("/login-logs");
}

/* =========================
 *  用户管理
 * =======================*/

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

// 获取用户详情（用户详情页、编辑页用）
export function getUserDetail(userId) {
  return request(`/users/${userId}`);
}

// 兼容命名：有的组件可能用 fetchUserDetail
export function fetchUserDetail(userId) {
  return getUserDetail(userId);
}

// 更新用户（编辑用户信息）
export function updateUser(userId, data) {
  return request(`/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}