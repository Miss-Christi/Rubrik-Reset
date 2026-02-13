import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
});

// Request interceptor: attach token
API.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

// Response interceptor: handle 401
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export const login = (email, password) => API.post("/auth/login", { email, password });
export const register = (name, email, password) => API.post("/auth/register", { name, email, password });
export const getCurrentUser = () => API.get("/auth/me");
export const getAdminUsers = () => API.get("/admin/users");

export default API;
