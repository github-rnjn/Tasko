import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {

    const {
        isAuthenticated,
        isLoading,
    } = useAuth();

    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-sm text-slate-500">
                    Loading...
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location.pathname,
                }}
            />
        );
    }

    return <Outlet />;
};

export default ProtectedRoute;