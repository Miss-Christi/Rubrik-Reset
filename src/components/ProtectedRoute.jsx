import { useContext } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ allowedRoles, children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    // 1. Loading State: Uses the stylized Loader2 spinner
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin h-10 w-10 text-rubrik-red" />
                <p className="ml-3 text-sm font-bold text-slate-500 uppercase tracking-widest">Verifying Access...</p>
            </div>
        );
    }

    // 2. Authentication Check: Redirects to login and saves the current location
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 3. Authorization (Role) Check: Ensuring the user has the right permissions
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirects admins to /admin and regular users to /dashboard if they go to the wrong place
        return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
    }

    // 4. Content Delivery: Support for both {children} and <Outlet />
    return children ? children : <Outlet />;
};

export default ProtectedRoute;