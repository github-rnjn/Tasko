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
import Tasks from "../pages/Tasks";
import Categories from "../pages/Categories";
import Profile from "../pages/Profile";

const AppRoutes = () => {

    return (
        <Routes>

            {/* =========================
                PUBLIC ROUTES
            ========================= */}

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


            {/* =========================
                PROTECTED APPLICATION
            ========================= */}

            <Route element={<ProtectedRoute />}>

                <Route element={<AppLayout />}>

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/tasks"
                        element={<Tasks />}
                    />

                    
                    <Route
                        path="/categories"
                        element={<Categories />}
                    />

                    <Route
                        path="/profile"
                        element={<Profile />}
                    />

                </Route>

            </Route>


            {/* =========================
                DEFAULT
            ========================= */}

            <Route
                path="/"
                element={
                    <Navigate
                        to="/dashboard"
                        replace
                    />
                }
            />

            {/* =========================
                UNKNOWN ROUTE
            ========================= */}

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