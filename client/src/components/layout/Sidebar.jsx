import {
    CheckSquare,
    Folder,
    LayoutDashboard,
    UserCircle,
    X,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const Sidebar = ({
    open = false,
    onClose = () => {},
}) => {

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

    const sidebarContent = (

        <>

            {/* Logo */}

            <div className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-indigo-100/80">

                <div className="flex items-center gap-2">

                    <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                        <CheckSquare
                            size={18}
                            className="text-white"
                        />
                    </div>

                    <span className="text-lg font-bold text-slate-900">
                        Tasko
                    </span>

                </div>

                {/* Close button, mobile only */}

                <button
                    type="button"
                    onClick={onClose}
                    className="md:hidden rounded-lg p-2 text-indigo-400 hover:bg-indigo-100/70 hover:text-indigo-900"
                    aria-label="Close menu"
                >
                    <X size={20} />
                </button>

            </div>

            {/* Navigation */}

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">

                {navigation.map((item) => {

                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                                    isActive
                                        ? "bg-indigo-100 text-indigo-800"
                                        : "text-indigo-950/60 hover:bg-indigo-100/60 hover:text-indigo-900"
                                }`
                            }
                        >
                            <Icon size={19} />
                            {item.name}
                        </NavLink>
                    );
                })}

            </nav>

        </>
    );

    return (

        <>

            {/* Desktop sidebar */}

            <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-indigo-100/80 bg-indigo-50/60">
                {sidebarContent}
            </aside>


            {/* Mobile overlay */}

            <div
                className={`md:hidden fixed inset-0 z-40 bg-black/40 transition-opacity ${
                    open
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                }`}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Mobile drawer */}

            <aside
                className={`md:hidden fixed inset-y-0 left-0 z-50 flex w-72 max-w-[80vw] flex-col bg-indigo-50/60 shadow-xl transition-transform duration-200 ease-in-out ${
                    open
                        ? "translate-x-0"
                        : "-translate-x-full"
                }`}
            >
                {sidebarContent}
            </aside>

        </>
    );
};

export default Sidebar;