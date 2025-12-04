import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api'
});

// 每次请求自动带上 token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email, password) => {
  const res = await api.post('/login', { email, password });
  // 预期后端返回: { token: 'xxx', user: { ... } }
  return res.data;
};

export const fetchMe = async () => {
  const res = await api.get('/me');
  return res.data;
};

export const logout = async () => {
  await api.post('/logout');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const fetchDashboardStats = async () => {
  const res = await api.get('/dashboard');
  return res.data;
};

export const fetchProducts = async () => {
  const res = await api.get('/products');
  return res.data; // 预期是数组
};

export const createProduct = async (formData) => {
  // formData: 已经是 FormData 对象（包含图片）
  const res = await api.post('/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
};

export const updateProductReview = async (productId, reviewResult) => {
  const res = await api.put(`/products/${productId}/review`, {
    review_result: reviewResult
  });
  return res.data;
};

export const fetchReviews = async () => {
  const res = await api.get('/reviews');
  return res.data;
};

export const fetchLoginLogs = async () => {
  const res = await api.get('/login-logs');
  return res.data;
};

export default api;

