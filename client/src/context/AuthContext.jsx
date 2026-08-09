import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import * as authApi from "../api/auth.api";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const [accessToken, setAccessToken] =
        useState(
            () => localStorage.getItem("accessToken")
        );

    const [isLoading, setIsLoading] =
        useState(true);

    const isAuthenticated =
        Boolean(accessToken && user);

    const login = async (data) => {

        const response =
            await authApi.login(data);

        const token =
            response.data.accessToken;

        const loggedInUser =
            response.data.user;

        localStorage.setItem(
            "accessToken",
            token
        );

        setAccessToken(token);

        const userResponse =
        await api.get("/users/me");

        const currentUser =
        userResponse.data.data;

        setUser(currentUser);

        return response;
    };

    const logout = async () => {

        try {
            await authApi.logout();
        } finally {

            localStorage.removeItem(
                "accessToken"
            );

            setAccessToken(null);
            setUser(null);
        }
    };

    const initializeAuth = async () => {

        const storedToken =
            localStorage.getItem("accessToken");

        if (!storedToken) {
            setIsLoading(false);
            return;
        }

        try {

            const response =
                await api.get("/users/me");

            setUser(response.data.data);

        } catch (error) {

            localStorage.removeItem(
                "accessToken"
            );

            setAccessToken(null);
            setUser(null);

        } finally {

            setIsLoading(false);
        }
    };

    const updateUser = (updatedUser) => {

        setUser((currentUser) => ({
            ...currentUser,
            ...updatedUser,
        }));
    };

    useEffect(() => {
        initializeAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                isAuthenticated,
                isLoading,
                login,
                logout,
                updateUser,
                initializeAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {

    const context =
        useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
};