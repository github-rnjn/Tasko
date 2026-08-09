import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
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

        if (
            error.response?.status !== 401 ||
            originalRequest._retry
        ) {
            return Promise.reject(error);
        }

        /*
         * Don't try to refresh the token if
         * the failed request itself was the
         * refresh-token request.
         */
        if (
            originalRequest.url?.includes(
                "/auth/refresh-token"
            )
        ) {
            localStorage.removeItem("accessToken");

            return Promise.reject(error);
        }

        if (isRefreshing) {

            return new Promise(
                (resolve, reject) => {

                    failedQueue.push({
                        resolve,
                        reject,
                    });

                }
            ).then((token) => {

                originalRequest.headers.Authorization =
                    `Bearer ${token}`;

                return api(originalRequest);

            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {

            /*
             * Do NOT manually send the refresh token.
             *
             * The browser sends the HTTP-only
             * cookie automatically because
             * withCredentials is true.
             */
            const response = await api.post(
                "/auth/refresh-token"
            );

            const newAccessToken =
                response.data.data.accessToken;

            localStorage.setItem(
                "accessToken",
                newAccessToken
            );

            processQueue(
                null,
                newAccessToken
            );

            originalRequest.headers.Authorization =
                `Bearer ${newAccessToken}`;

            return api(originalRequest);

        } catch (refreshError) {

            processQueue(
                refreshError,
                null
            );

            localStorage.removeItem(
                "accessToken"
            );

            return Promise.reject(
                refreshError
            );

        } finally {

            isRefreshing = false;

        }
    }
);

export default api;