import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const AppLayout = () => {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 flex">

            <Sidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="flex-1 min-w-0 flex flex-col">

                <Navbar
                    onMenuClick={() => setSidebarOpen(true)}
                />

                <main className="flex-1 p-4 sm:p-6">

                    <Outlet />

                </main>

            </div>

        </div>
    );
};

export default AppLayout;