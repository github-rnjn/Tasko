import {
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyEmail from "../pages/auth/VerifyEmail";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

const AppRoutes = () => {

    return (
        <Routes>

            {/* Public authentication pages */}

            <Route element={<PublicRoute />}>

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/verify-email"
                    element={<VerifyEmail />}
                />

                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />

                <Route
                    path="/reset-password"
                    element={<ResetPassword />}
                />

            </Route>

            {/* Protected application pages */}

            <Route element={<ProtectedRoute />}>

                {/* Dashboard will be added here */}

                <Route
                    path="/dashboard"
                    element={
                        <div className="min-h-screen flex items-center justify-center">
                            <h1 className="text-2xl font-bold">
                                Dashboard
                            </h1>
                        </div>
                    }
                />

            </Route>

            {/* Default */}

            <Route
                path="/"
                element={
                    <Navigate
                        to="/dashboard"
                        replace
                    />
                }
            />

            {/* Unknown route */}

            <Route
                path="*"
                element={
                    <Navigate
                        to="/dashboard"
                        replace
                    />
                }
            />

        </Routes>
    );
};

export default AppRoutes;