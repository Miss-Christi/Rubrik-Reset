import { createContext, useState, useEffect } from "react";
import { login as apiLogin, register as apiRegister, API_BASE_URL } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Auto-check token on load
    useEffect(() => {
        const checkAuth = () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem("user"));
                if (storedUser?.token) {
                    setUser(storedUser);
                }
            } catch (err) {
                console.error("Auth check failed:", err);
                localStorage.removeItem("user");
            } finally {
                console.log("AuthCheck finished. Loading set to false.");
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const loginUser = async (email, password) => {
        setError(null);
        try {
            const { data } = await apiLogin(email, password);
            localStorage.setItem("user", JSON.stringify(data));
            setUser(data);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
            throw err;
        }
    };

    const registerUser = async (name, email, password) => {
        setError(null);
        try {
            const { data } = await apiRegister(name, email, password);
            localStorage.setItem("user", JSON.stringify(data));
            setUser(data);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
            throw err;
        }
    };

    const logout = async () => {
        try {
            // 1. Clear from localStorage so useEffect doesn't auto-login
            localStorage.removeItem("user");

            // 2. Clear the user from your React state
            setUser(null);

            // 3. Inform backend (ignoring errors if no axios imported or backend offline)
            try {
                // Dynamically import axios so we don't crash if not at top level
                const axios = (await import("axios")).default;
                // Strip "/api" from the end of the API_BASE_URL to hit the root auth routes
                const baseUrl = API_BASE_URL.replace('/api', '');
                await axios.get(`${baseUrl}/auth/logout`, { withCredentials: true });
            } catch (e) { console.log('Backend logout skipped'); }

            // 4. Redirect to homepage
            window.location.href = "/";
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    const updateUser = (updatedFields) => {
        const newUser = { ...user, ...updatedFields };
        localStorage.setItem("user", JSON.stringify(newUser));
        setUser(newUser);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                error,
                login: loginUser,
                register: registerUser,
                logout,
                setUser,
                updateUser,
            }}
        >
            {loading ? (
                <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                    <div style={{ textAlign: 'center' }}>
                        <h1 style={{ fontSize: '14px', fontWeight: '900', color: '#ef3e36', letterSpacing: '0.2em' }}>VERIFYING SESSION...</h1>
                        <p style={{ fontSize: '10px', color: '#64748b', marginTop: '10px', fontWeight: 'bold' }}>RUBRIK RESET DIGITAL TERMINAL</p>
                    </div>
                </div>
            ) : children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
