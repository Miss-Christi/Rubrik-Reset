import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "/api" : "http://127.0.0.1:5000/api"),
    timeout: 10000, // 10 seconds timeout to prevent infinite hang
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

export const login = (email, password) => API.post("/login", { email, password });
export const register = (name, email, password) => API.post("/register", { name, email, password });
export const getCurrentUser = () => API.get("/me");
export const getAdminUsers = () => API.get("/admin/users");

// Challenge endpoints
export const getChallenges = () => API.get("/challenges");
export const getChallengeById = (id) => API.get(`/challenges/${id}`);
export const joinChallenge = (id) => API.post(`/challenges/${id}/join`);
export const getChallengeProgress = (id) => API.get(`/challenges/${id}/progress`);
export const submitChallengeDay = (id, dayId, submissionText) => API.post(`/challenges/${id}/days/${dayId}/submit`, { submissionText });
export const getLeaderboard = (id) => API.get(`/challenges/${id}/leaderboard`);

// Wishlist endpoints
export const getWishlist = () => API.get("/wishlist");
export const toggleProductWishlist = (id) => API.post(`/wishlist/products/${id}`);
export const toggleChallengeWishlist = (id) => API.post(`/wishlist/challenges/${id}`);

export default API;
