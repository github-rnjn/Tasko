import { useEffect, useRef, useState } from "react";

import { useAuth } from "../context/AuthContext";

import {
    AlertCircle,
    Camera,
    Eye,
    EyeOff,
    Loader2,
    Save,
} from "lucide-react";

import {
    changePassword,
    getProfile,
    updateAvatar,
    updateProfile,
} from "../api/profile.api";

const Profile = () => {

    const {updateUser} = useAuth();

    const fileInputRef = useRef(null);

    const [profile, setProfile] = useState(null);

    const [loading, setLoading] = useState(true);

    const [savingProfile, setSavingProfile] =
        useState(false);

    const [savingPassword, setSavingPassword] =
        useState(false);

    const [uploadingAvatar, setUploadingAvatar] =
        useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [profileForm, setProfileForm] = useState({
        name: "",
        email: "",
    });

    const [passwordForm, setPasswordForm] =
        useState({
            currentPassword: "",
            newPassword: "",
        });

    const [showCurrentPassword, setShowCurrentPassword] =
        useState(false);

    const [showNewPassword, setShowNewPassword] =
        useState(false);


    const fetchProfile = async () => {

        setLoading(true);
        setError("");

        try {

            const response =
                await getProfile();

            const data = response.data;

            setProfile(data);

            setProfileForm({
                name: data.name || "",
                email: data.email || "",
            });

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to load profile."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        fetchProfile();
    }, []);


    const handleProfileChange = (event) => {

        const {
            name,
            value,
        } = event.target;

        setProfileForm(
            (current) => ({
                ...current,
                [name]: value,
            })
        );
    };


    const handleProfileSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        setSavingProfile(true);

        try {

            const response =
                await updateProfile(
                    profileForm
                );

            setProfile(response.data);

            updateUser(response.data);

            setProfileForm({
                name:
                    response.data.name || "",
                email:
                    response.data.email || "",
            });

            setSuccess(
                "Profile updated successfully."
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to update profile."
            );

        } finally {

            setSavingProfile(false);

        }
    };


    const handleAvatarChange = async (
        event
    ) => {

        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        setError("");
        setSuccess("");
        setUploadingAvatar(true);

        try {

            const response =
                await updateAvatar(file);

            setProfile(
                response.data
            );

            updateUser(response.data);

            setSuccess(
                "Avatar updated successfully."
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to update avatar."
            );

        } finally {

            setUploadingAvatar(false);

            /*
             * Allows selecting the same file
             * again after an upload.
             */
            event.target.value = "";
        }
    };


    const handlePasswordChange = (
        event
    ) => {

        const {
            name,
            value,
        } = event.target;

        setPasswordForm(
            (current) => ({
                ...current,
                [name]: value,
            })
        );
    };


    const handlePasswordSubmit = async (
        event
    ) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        setSavingPassword(true);

        try {

            await changePassword(
                passwordForm
            );

            setPasswordForm({
                currentPassword: "",
                newPassword: "",
            });

            setSuccess(
                "Password changed successfully. Please login again."
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to change password."
            );

        } finally {

            setSavingPassword(false);

        }
    };


    if (loading) {

        return (
            <div className="min-h-100 flex items-center justify-center">

                <div className="flex items-center gap-2 text-sm text-slate-500">

                    <Loader2
                        size={18}
                        className="animate-spin"
                    />

                    Loading profile...

                </div>

            </div>
        );
    }


    if (!profile) {

        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5">

                <div className="flex items-center gap-2 text-red-600">

                    <AlertCircle size={18} />

                    <span className="text-sm font-medium">
                        {error || "Profile could not be loaded."}
                    </span>

                </div>

                <button
                    type="button"
                    onClick={fetchProfile}
                    className="mt-3 text-sm font-medium text-red-700 hover:underline"
                >
                    Try again
                </button>

            </div>
        );
    }


    return (
        <div className="space-y-6">

            {/* Header */}

            <div>

                <h1 className="text-2xl font-bold text-slate-900">
                    Profile
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Manage your account information and password.
                </p>

            </div>


            {/* Messages */}

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                    <div className="flex items-center gap-2 text-sm text-red-600">

                        <AlertCircle size={17} />

                        {error}

                    </div>

                </div>
            )}

            {success && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3">

                    <p className="text-sm text-green-700">
                        {success}
                    </p>

                </div>
            )}


            {/* Profile information */}

            <div className="rounded-xl border border-slate-200 bg-white">

                <div className="border-b border-slate-200 px-6 py-5">

                    <h2 className="font-semibold text-slate-900">
                        Profile information
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                        Update your basic account information.
                    </p>

                </div>


                <div className="p-6">

                    {/* Avatar */}

                    <div className="flex items-center gap-4 mb-6">

                        <div className="relative">

                            {profile.avatar ? (

                                <img
                                    src={profile.avatar}
                                    alt="Profile avatar"
                                    className="h-20 w-20 rounded-full object-cover border border-slate-200"
                                />

                            ) : (

                                <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center text-2xl font-semibold text-slate-600">
                                    {profile.name
                                        ?.charAt(0)
                                        ?.toUpperCase()}
                                </div>

                            )}

                            <button
                                type="button"
                                onClick={() =>
                                    fileInputRef.current?.click()
                                }
                                disabled={
                                    uploadingAvatar
                                }
                                className="absolute bottom-0 right-0 rounded-full border border-white bg-slate-900 p-2 text-white shadow-sm hover:bg-slate-800 disabled:opacity-60"
                            >

                                {uploadingAvatar ? (
                                    <Loader2
                                        size={14}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <Camera
                                        size={14}
                                    />
                                )}

                            </button>

                        </div>

                        <div>

                            <p className="text-sm font-medium text-slate-900">
                                Profile picture
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Upload a new profile picture.
                            </p>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={
                                    handleAvatarChange
                                }
                                className="hidden"
                            />

                        </div>

                    </div>


                    {/* Form */}

                    <form
                        onSubmit={
                            handleProfileSubmit
                        }
                        className="space-y-5"
                    >

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                            {/* Name */}

                            <div>

                                <label
                                    htmlFor="name"
                                    className="mb-1.5 block text-sm font-medium text-slate-700"
                                >
                                    Name
                                </label>

                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={
                                        profileForm.name
                                    }
                                    onChange={
                                        handleProfileChange
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
                                />

                            </div>


                            {/* Email */}

                            <div>

                                <label
                                    htmlFor="email"
                                    className="mb-1.5 block text-sm font-medium text-slate-700"
                                >
                                    Email
                                </label>

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={
                                        profileForm.email
                                    }
                                    onChange={
                                        handleProfileChange
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
                                />

                            </div>

                        </div>


                        <div className="flex justify-end border-t border-slate-100 pt-5">

                            <button
                                type="submit"
                                disabled={
                                    savingProfile
                                }
                                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >

                                {savingProfile ? (
                                    <Loader2
                                        size={17}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <Save
                                        size={17}
                                    />
                                )}

                                {savingProfile
                                    ? "Saving..."
                                    : "Save changes"}

                            </button>

                        </div>

                    </form>

                </div>

            </div>


            {/* Change password */}

            <div className="rounded-xl border border-slate-200 bg-white">

                <div className="border-b border-slate-200 px-6 py-5">

                    <h2 className="font-semibold text-slate-900">
                        Change password
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                        Update your password to keep your account secure.
                    </p>

                </div>


                <form
                    onSubmit={
                        handlePasswordSubmit
                    }
                    className="space-y-5 p-6"
                >

                    {/* Current password */}

                    <div>

                        <label
                            htmlFor="currentPassword"
                            className="mb-1.5 block text-sm font-medium text-slate-700"
                        >
                            Current password
                        </label>

                        <div className="relative">

                            <input
                                id="currentPassword"
                                name="currentPassword"
                                type={
                                    showCurrentPassword
                                        ? "text"
                                        : "password"
                                }
                                value={
                                    passwordForm.currentPassword
                                }
                                onChange={
                                    handlePasswordChange
                                }
                                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 pr-10 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowCurrentPassword(
                                        (value) =>
                                            !value
                                    )
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showCurrentPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>

                        </div>

                    </div>


                    {/* New password */}

                    <div>

                        <label
                            htmlFor="newPassword"
                            className="mb-1.5 block text-sm font-medium text-slate-700"
                        >
                            New password
                        </label>

                        <div className="relative">

                            <input
                                id="newPassword"
                                name="newPassword"
                                type={
                                    showNewPassword
                                        ? "text"
                                        : "password"
                                }
                                value={
                                    passwordForm.newPassword
                                }
                                onChange={
                                    handlePasswordChange
                                }
                                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 pr-10 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowNewPassword(
                                        (value) =>
                                            !value
                                    )
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showNewPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>

                        </div>

                    </div>


                    <div className="flex justify-end border-t border-slate-100 pt-5">

                        <button
                            type="submit"
                            disabled={
                                savingPassword
                            }
                            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >

                            {savingPassword && (
                                <Loader2
                                    size={17}
                                    className="animate-spin"
                                />
                            )}

                            {savingPassword
                                ? "Changing..."
                                : "Change password"}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default Profile;