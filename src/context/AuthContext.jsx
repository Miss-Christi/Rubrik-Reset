import { createContext, useState, useEffect } from "react";
import { login as apiLogin, register as apiRegister } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Auto-check token on load
    useEffect(() => {
        const checkAuth = () => {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            if (storedUser?.token) {
                setUser(storedUser);
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const loginUser = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await apiLogin(email, password);
            localStorage.setItem("user", JSON.stringify(data));
            setUser(data);
            setLoading(false);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
            setLoading(false);
            throw err;
        }
    };

    const registerUser = async (name, email, password) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await apiRegister(name, email, password);
            localStorage.setItem("user", JSON.stringify(data));
            setUser(data);
            setLoading(false);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
            setLoading(false);
            throw err;
        }
    };

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
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
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
