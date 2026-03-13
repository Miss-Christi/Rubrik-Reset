import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Lock, Eye, EyeOff, Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-toastify";
import { resetPassword } from "../services/api";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        setIsLoading(true);
        try {
            await resetPassword(token, password);
            setIsSuccess(true);
            toast.success("Password reset successful!");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Invalid or expired token.");
        } finally {
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
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-md mb-4 flex-shrink-0">
                        <img src="/Rubrik_Logo.png" alt="RR" className="w-10 h-10 object-contain" />
                    </div>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="p-8">
                        {isSuccess ? (
                            <div className="text-center">
                                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Password Reset!</h2>
                                <p className="text-gray-600 mb-6">
                                    Your password has been successfully reset. You can now log in with your new password.
                                </p>
                                <Link
                                    to="/login"
                                    className="inline-flex justify-center items-center w-full py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-rubrik-navy hover:bg-gray-800 transition-all duration-300"
                                >
                                    Log In Now
                                </Link>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">
                                    Create New Password
                                </h2>
                                <p className="text-center text-sm text-gray-500 mb-6">
                                    Please enter your new password below.
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Password Field */}
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-700 ml-1">New Password</label>
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
                                                minLength={8}
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                                                >
                                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Confirm Password Field */}
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-700 ml-1">Confirm New Password</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-rubrik-blue transition-colors">
                                                <Lock className="h-5 w-5" />
                                            </div>
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                className={`block w-full pl-10 pr-10 py-3 border rounded-xl leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-rubrik-blue/20 transition-all duration-200 ${confirmPassword && password !== confirmPassword
                                                        ? "border-red-300 focus:border-red-500"
                                                        : "border-gray-200 focus:border-rubrik-blue"
                                                    }`}
                                                placeholder="••••••••"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                                                >
                                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                </button>
                                            </div>
                                        </div>
                                        {confirmPassword && password !== confirmPassword && (
                                            <p className="text-xs text-red-500 ml-1 mt-1 flex items-center gap-1">
                                                <XCircle className="h-3 w-3" /> Passwords do not match
                                            </p>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-rubrik-red/20 text-sm font-bold text-white bg-rubrik-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rubrik-red disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                                Resetting...
                                            </>
                                        ) : (
                                            "Reset Password"
                                        )}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
