import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://localhost/api", // nginx 会转发到 backend
});

// 自动附加 Token
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosClient;
