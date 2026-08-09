import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const PublicRoute = () => {

    const {
        isAuthenticated,
        isLoading,
    } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-sm text-slate-500">
                    Loading...
                </div>
            </div>
        );
    }

    if (isAuthenticated) {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }

    return <Outlet />;
};

export default PublicRoute;