import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import AuthContext from "../context/AuthContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const user = await login(email, password);
            // Simulate a small delay for better UX
            setTimeout(() => {
                if (user.role === 'admin') {
                    navigate("/admin");
                } else {
                    navigate("/dashboard");
                }
            }, 500);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-rubrik-red/5 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 -right-24 w-64 h-64 bg-rubrik-blue/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-rubrik-navy/5 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-[420px] z-10 animate-fade-in-up">
                {/* Brand Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-md mb-4 rotate-3 hover:rotate-0 transition-all duration-500">
                        <img src="/Rubrik_Logo.png" alt="RR" className="w-10 h-10 object-contain" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-rubrik-navy tracking-tight mb-2">
                        Rubrik <span className="text-rubrik-red">Reset</span>
                    </h1>
                    <p className="text-rubrik-blue font-medium text-sm tracking-wide uppercase">
                        Reset. Restore. Reimagine.
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="p-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
                            Login to your account
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email Field */}
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700 ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-rubrik-blue transition-colors">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <input
                                        type="email"
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-rubrik-blue/20 focus:border-rubrik-blue transition-all duration-200"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700 ml-1">Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-rubrik-blue transition-colors">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-rubrik-blue/20 focus:border-rubrik-blue transition-all duration-200"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-rubrik-red focus:ring-rubrik-red border-gray-300 rounded cursor-pointer"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <label
                                        htmlFor="remember-me"
                                        className="ml-2 block text-sm text-gray-600 cursor-pointer select-none"
                                    >
                                        Remember me
                                    </label>
                                </div>
                                <div className="text-sm">
                                    <a
                                        href="#"
                                        className="font-medium text-rubrik-blue hover:text-rubrik-navy transition-colors"
                                    >
                                        Forgot password?
                                    </a>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-rubrik-red/20 text-sm font-bold text-white bg-rubrik-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rubrik-red disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 transform hover:translate-y-[-1px]"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                        Logging in...
                                    </>
                                ) : (
                                    <>
                                        Login <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Footer of Card */}
                    <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="font-bold text-rubrik-red hover:text-rubrik-navy transition-colors"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Page Footer */}
                <p className="text-center text-xs text-gray-400 mt-8">
                    &copy; 2026 Rubrik Reset. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Login;
