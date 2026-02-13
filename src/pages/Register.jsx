import { useState, useContext } from "react";
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
    Circle,
} from "lucide-react";
import AuthContext from "../context/AuthContext";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const getPasswordRequirements = (password) => {
        return [
            { id: 1, text: "At least 8 characters", met: password.length >= 8 },
            { id: 2, text: "One uppercase letter (A-Z)", met: /[A-Z]/.test(password) },
            { id: 3, text: "One lowercase letter (a-z)", met: /[a-z]/.test(password) },
            { id: 4, text: "One number (0-9)", met: /[0-9]/.test(password) },
            { id: 5, text: "One special character (!@#$%^&*)", met: /[!@#$%^&*]/.test(password) },
        ];
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        if (!formData.agreeToTerms) {
            alert("Please agree to the Terms of Service.");
            return;
        }

        setIsLoading(true);
        try {
            await register(formData.name, formData.email, formData.password);
            setTimeout(() => navigate("/dashboard"), 500);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    const requirements = getPasswordRequirements(formData.password);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-rubrik-red/5 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 -right-24 w-64 h-64 bg-rubrik-blue/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-rubrik-navy/5 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-[500px] z-10 animate-fade-in-up">
                {/* Brand Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-md mb-4 rotate-3 hover:rotate-0 transition-all duration-500">
                        <img
                            src="/Rubrik_Logo.png"
                            alt="RR"
                            className="w-10 h-10 object-contain"
                        />
                    </div>
                    <h1 className="text-3xl font-extrabold text-rubrik-navy tracking-tight mb-2 uppercase">
                        Rubrik <span className="text-rubrik-red">Reset</span>
                    </h1>
                    <p className="text-rubrik-blue font-medium text-sm tracking-wide uppercase">
                        Reset. Restore. Reimagine.
                    </p>
                </div>

                {/* Register Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 relative">
                    <div className="p-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
                            Create your account
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Full Name Field */}
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700 ml-1">
                                    Full Name
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#1D4ED8] transition-colors">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] transition-all duration-200"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                    {formData.name.length > 2 && (
                                        <div className="absolute inset-y-0 right-3 flex items-center text-green-500">
                                            <CheckCircle className="h-4 w-4" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Email Field */}
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700 ml-1">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#1D4ED8] transition-colors">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] transition-all duration-200"
                                        placeholder="work@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                    {formData.email.includes("@") && (
                                        <div className="absolute inset-y-0 right-3 flex items-center text-green-500">
                                            <CheckCircle className="h-4 w-4" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-1 relative">
                                <label className="block text-sm font-medium text-gray-700 ml-1">
                                    Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#1D4ED8] transition-colors">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] transition-all duration-200"
                                        placeholder="Create password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        onFocus={() => setIsPasswordFocused(true)}
                                        onBlur={() => setIsPasswordFocused(false)}
                                        required
                                        minLength={8}
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

                                {/* Password Requirements Hint Box */}
                                <div
                                    className={`absolute z-20 left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 p-4 transition-all duration-200 transform origin-top ${isPasswordFocused
                                        ? "opacity-100 scale-100 translate-y-0 visible"
                                        : "opacity-0 scale-95 -translate-y-2 invisible"
                                        }`}
                                >
                                    <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                                        Password must include:
                                    </p>
                                    <ul className="space-y-1.5">
                                        {requirements.map((req) => (
                                            <li
                                                key={req.id}
                                                className={`flex items-center text-xs transition-colors duration-200 ${req.met ? "text-green-600 font-medium" : "text-gray-500"
                                                    }`}
                                            >
                                                {req.met ? (
                                                    <CheckCircle className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                                                ) : (
                                                    <Circle className="h-3.5 w-3.5 mr-2 flex-shrink-0 text-gray-300" />
                                                )}
                                                {req.text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Confirm Password Field */}
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700 ml-1">
                                    Confirm Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#1D4ED8] transition-colors">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        className={`block w-full pl-10 pr-10 py-3 border rounded-xl leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1D4ED8]/20 transition-all duration-200 ${formData.confirmPassword &&
                                            formData.password !== formData.confirmPassword
                                            ? "border-red-300 focus:border-red-500"
                                            : "border-gray-200 focus:border-[#1D4ED8]"
                                            }`}
                                        placeholder="Confirm password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                {formData.confirmPassword &&
                                    formData.password !== formData.confirmPassword && (
                                        <p className="text-xs text-red-500 ml-1 mt-1 flex items-center gap-1">
                                            <XCircle className="h-3 w-3" /> Passwords do not match
                                        </p>
                                    )}
                            </div>

                            {/* Terms Checkbox */}
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="agreeToTerms"
                                        name="agreeToTerms"
                                        type="checkbox"
                                        className="h-4 w-4 text-[#1D4ED8] focus:ring-[#1D4ED8] border-gray-300 rounded cursor-pointer"
                                        checked={formData.agreeToTerms}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="agreeToTerms" className="font-medium text-gray-700">
                                        I agree to the{" "}
                                        <a href="#" className="text-[#1D4ED8] hover:underline">
                                            Terms of Service
                                        </a>{" "}
                                        and{" "}
                                        <a href="#" className="text-[#1D4ED8] hover:underline">
                                            Privacy Policy
                                        </a>
                                    </label>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-lg shadow-lg shadow-rubrik-red/20 text-sm font-bold text-white bg-[#E63946] hover:bg-[#d32f2f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E63946] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 transform hover:translate-y-[-1px] uppercase tracking-wide"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        Sign Up <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Footer of Card */}
                    <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-bold text-[#1D4ED8] hover:text-[#1e40af] transition-colors hover:underline"
                            >
                                Sign in
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

export default Register;
