import api from "./axios";

export const getProfile = async () => {
    const response = await api.get("/profile");

    return response.data;
};

export const updateProfile = async (data) => {
    const response = await api.patch(
        "/profile",
        data
    );

    return response.data;
};

export const changePassword = async (data) => {
    const response = await api.patch(
        "/profile/change-password",
        data
    );

    return response.data;
};

export const updateAvatar = async (file) => {

    const formData = new FormData();

    formData.append("avatar", file);

    const response = await api.patch(
        "/profile/avatar",
        formData
    );

    return response.data;
};