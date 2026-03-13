import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import { forgotPassword } from "../services/api";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await forgotPassword(email);
            setIsSent(true);
            toast.success("Password reset email sent!");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Something went wrong.");
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
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-md mb-4 rotate-3 hover:rotate-0 transition-all duration-500">
                        <img src="/Rubrik_Logo.png" alt="RR" className="w-10 h-10 object-contain" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-rubrik-navy tracking-tight mb-2">
                        Rubrik <span className="text-rubrik-red">Reset</span>
                    </h1>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="p-8">
                        {isSent ? (
                            <div className="text-center">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Check your email</h2>
                                <p className="text-gray-600 mb-6">
                                    We've sent a password reset link to <strong>{email}</strong>.
                                    The link will expire in 10 minutes.
                                </p>
                                <Link
                                    to="/login"
                                    className="inline-flex items-center justify-center w-full py-3 px-4 border border-gray-200 rounded-xl bg-gray-50 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
                                </Link>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">
                                    Forgot Password
                                </h2>
                                <p className="text-center text-sm text-gray-500 mb-6">
                                    Enter your official email address and we'll send you a link to reset your password.
                                </p>

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
                                                placeholder="you@gmail.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
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
                                                Sending...
                                            </>
                                        ) : (
                                            "Send Reset Link"
                                        )}
                                    </button>
                                </form>
                                <div className="mt-6 text-center">
                                    <Link to="/login" className="text-sm font-medium text-rubrik-blue hover:text-rubrik-navy transition-colors">
                                        &larr; Back to Login
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
