import {
    LogOut,
    Menu,
    UserCircle,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const Navbar = ({
    onMenuClick = () => {},
}) => {

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

            <div className="h-full px-3 sm:px-6 flex items-center justify-between gap-2">

                {/* Menu + Welcome */}

                <div className="flex items-center gap-2 min-w-0">

                    {/* Hamburger, mobile only */}

                    <button
                        type="button"
                        onClick={onMenuClick}
                        className="md:hidden shrink-0 rounded-lg p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        aria-label="Open menu"
                    >
                        <Menu size={20} />
                    </button>

                    <div className="min-w-0">

                        <p className="text-sm text-slate-500">
                            Welcome back
                        </p>

                        <p className="text-sm font-semibold text-slate-900 truncate">
                            {user?.name || "User"}
                        </p>

                    </div>

                </div>


                {/* User section */}

                <div className="flex items-center gap-2 sm:gap-4 shrink-0">

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

                        <span className="text-sm font-medium text-slate-700 max-w-32 truncate">
                            {user?.name || "User"}
                        </span>

                    </div>


                    {/* Logout */}

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex cursor-pointer items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700"
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