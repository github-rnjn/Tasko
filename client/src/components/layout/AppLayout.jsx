import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const AppLayout = () => {

    return (
        <div className="min-h-screen bg-slate-50 flex">

            <Sidebar />

            <div className="flex-1 min-w-0 flex flex-col">

                <Navbar />

                <main className="flex-1 p-4 sm:p-6">

                    <Outlet />

                </main>

            </div>

        </div>
    );
};

export default AppLayout;