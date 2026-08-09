import {
    LogOut,
    UserCircle,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const Navbar = () => {

    const {
        user,
        logout,
    } = useAuth();

    const handleLogout = async () => {

        try {
            await logout();
        } catch {
            // AuthContext clears authentication
            // state even if backend logout fails.
        }
    };

    return (
        <header className="h-16 shrink-0 border-b border-slate-200 bg-white">

            <div className="h-full px-4 sm:px-6 flex items-center justify-between">

                {/* Welcome */}

                <div>

                    <p className="text-sm text-slate-500">
                        Welcome back
                    </p>

                    <p className="text-sm font-semibold text-slate-900">
                        {user?.name || "User"}
                    </p>

                </div>


                {/* User section */}

                <div className="flex items-center gap-4">

                    <div className="hidden sm:flex items-center gap-2">

                        {/* Avatar */}

                        {user?.avatar ? (

                            <img
                                src={user.avatar}
                                alt="Profile"
                                className="h-9 w-9 rounded-full object-cover border border-slate-200"
                            />

                        ) : (

                            <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center">

                                {user?.name ? (

                                    <span className="text-sm font-semibold text-slate-600">
                                        {user.name
                                            .charAt(0)
                                            .toUpperCase()}
                                    </span>

                                ) : (

                                    <UserCircle
                                        size={22}
                                        className="text-slate-500"
                                    />

                                )}

                            </div>

                        )}

                        <span className="text-sm font-medium text-slate-700">
                            {user?.name || "User"}
                        </span>

                    </div>


                    {/* Logout */}

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
                    >

                        <LogOut size={17} />

                        <span className="hidden sm:inline">
                            Logout
                        </span>

                    </button>

                </div>

            </div>

        </header>
    );
};

export default Navbar;