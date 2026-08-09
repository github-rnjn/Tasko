import {
    CheckSquare,
    Folder,
    LayoutDashboard,
    UserCircle,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const Sidebar = () => {

    const navigation = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            name: "Tasks",
            path: "/tasks",
            icon: CheckSquare,
        },
        {
            name: "Categories",
            path: "/categories",
            icon: Folder,
        },
        {
            name: "Profile",
            path: "/profile",
            icon: UserCircle,
        },
    ];

    return (
        <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white">

            {/* Logo */}

            <div className="h-16 flex items-center px-6 border-b border-slate-200">

                <div className="flex items-center gap-2">

                    <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center">
                        <CheckSquare
                            size={18}
                            className="text-white"
                        />
                    </div>

                    <span className="text-lg font-bold text-slate-900">
                        Tasko
                    </span>

                </div>

            </div>

            {/* Navigation */}

            <nav className="flex-1 p-4 space-y-1">

                {navigation.map((item) => {

                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                                    isActive
                                        ? "bg-slate-100 text-slate-900"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                }`
                            }
                        >
                            <Icon size={19} />
                            {item.name}
                        </NavLink>
                    );
                })}

            </nav>

        </aside>
    );
};

export default Sidebar;