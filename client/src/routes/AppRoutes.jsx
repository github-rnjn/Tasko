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
import AppLayout from "../components/layout/AppLayout";
import Dashboard from "../pages/Dashboard";

const AppRoutes = () => {

    return (
        <Routes>

            {/* PUBLIC */}

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


            {/* PROTECTED */}

            <Route element={<ProtectedRoute />}>

                <Route element={<AppLayout />}>

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                </Route>

            </Route>


            <Route
                path="/"
                element={
                    <Navigate
                        to="/dashboard"
                        replace
                    />
                }
            />

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