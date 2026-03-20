import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Loader2,
    CheckCircle,
    XCircle,
} from "lucide-react";
import AuthContext from "../context/AuthContext";
import { toast } from "react-toastify";

import { API_BASE_URL } from "../services/api";

const Register = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Force redirect if already logged in
    useEffect(() => {
        if (user) navigate("/");

        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        if (token) {
            const googleUser = {
                _id: urlParams.get("id"),
                name: urlParams.get("name"),
                email: urlParams.get("email"),
                role: urlParams.get("role"),
                token: token,
            };
            localStorage.setItem("user", JSON.stringify(googleUser));
            window.location.href = "/";
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#ef3e36] p-4 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-black/10 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-[420px] z-10 animate-fade-in-up">
                {/* Brand Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-[2rem] shadow-2xl mb-6 transition-transform hover:scale-105 duration-500">
                        <img src="/Rubrik_Logo.png" alt="RR" className="w-16 h-16 object-contain" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter mb-2 uppercase">
                        Join Rubrik Reset
                    </h1>
                    <p className="text-white/80 font-bold text-xs tracking-widest uppercase">
                        Reset. Restore. Reimagine.
                    </p>
                </div>

                {/* Register Card */}
                <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden border border-white/20">
                    <div className="p-10">
                        <h2 className="text-2xl font-black text-gray-900 mb-2 text-center tracking-tight">
                            Create Account
                        </h2>
                        <p className="text-center text-gray-500 text-sm font-medium mb-8">
                            Join our ecosystem of digital restoration
                        </p>

                        <div className="text-center mb-6">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                By continuing, you agree to our{" "}
                                <Link to="/legal" className="text-[#ef3e36] hover:underline">
                                    Terms & Privacy
                                </Link>
                            </p>
                        </div>

                        {/* Google Social SignUp */}
                        <div className="space-y-6">
                            <a
                                href={`${API_BASE_URL.split('/api')[0]}/auth/google`}
                                className="w-full flex justify-center items-center py-4 px-6 border-2 border-gray-100 rounded-2xl bg-white text-sm font-black text-gray-800 hover:bg-gray-50 hover:border-gray-200 transition-all duration-300 shadow-sm group"
                            >
                                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6 mr-4 group-hover:scale-110 transition-transform" alt="Google" />
                                Sign up with Google
                            </a>

                            <div className="bg-gray-50 rounded-2xl p-6 text-center">
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider leading-relaxed">
                                    Instant account creation with secure cross-platform synchronization
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer of Card */}
                    <div className="px-10 py-6 bg-gray-50/50 border-t border-gray-100 text-center">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Already a member?{" "}
                            <Link
                                to="/login"
                                className="text-[#ef3e36] hover:underline ml-1"
                            >
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Page Footer */}
                <p className="text-center text-[10px] font-bold text-white/40 mt-10 uppercase tracking-[0.3em]">
                    &copy; 2026 Rubrik Reset &bull; Digital Ecosystem
                </p>
            </div>
        </div>
    );
};

export default Register;
