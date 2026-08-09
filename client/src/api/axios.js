import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

let isRefreshing = false;

let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((promise) => {

        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token);
        }

    });

    failedQueue = [];
};

api.interceptors.request.use(
    (config) => {

        const accessToken =
            localStorage.getItem("accessToken");

        if (accessToken) {
            config.headers.Authorization =
                `Bearer ${accessToken}`;
        }

        return config;
    },

    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,

    async (error) => {

        const originalRequest = error.config;

        const url = originalRequest?.url || "";

        const isAuthRequest =
            url.includes("/auth/login") ||
            url.includes("/auth/register") ||
            url.includes("/auth/verify-email") ||
            url.includes("/auth/resend-verification") ||
            url.includes("/auth/forgot-password") ||
            url.includes("/auth/reset-password") ||
            url.includes("/auth/refresh-token");

        if (
            error.response?.status === 401 &&
            !isAuthRequest &&
            !originalRequest._retry
        ) {

            originalRequest._retry = true;

            try {

                const response =
                    await api.post(
                        "/auth/refresh-token"
                    );

                const newAccessToken =
                    response.data.data.accessToken;

                localStorage.setItem(
                    "accessToken",
                    newAccessToken
                );

                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                return api(originalRequest);

            } catch (refreshError) {

                localStorage.removeItem(
                    "accessToken"
                );

                return Promise.reject(
                    refreshError
                );
            }
        }

        return Promise.reject(error);
    }
);

export default api;