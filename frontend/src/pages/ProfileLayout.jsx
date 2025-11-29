import { Link, Outlet, useLocation } from "react-router";
import {User,Package} from "lucide-react";

function ProfileLayout() {
    const location = useLocation();

    const isActive = (path) =>
        location.pathname.startsWith(path)
            ? "bg-primary text-primary-content shadow-md"
            : "hover:bg-base-300";

    return (
        <div className="flex min-h-screen bg-base-200">

            {/* SIDEBAR */}
            <aside className="w-72 bg-base-100 border-r border-base-300 p-8">
                <h1 className="text-2xl font-bold mb-8 text-base-content">
                    My Profile
                </h1>

                <ul className="menu flex flex-col gap-2 text-base font-medium">

                    <li>
                        <Link
                            to="/profile/account"
                            className={`flex items-center gap-3 rounded-lg px-4 py-3 transition ${isActive("/profile/account")}`}
                        >
                            <User size={20} />
                            Account
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/profile/orderhistory"
                            className={`flex items-center gap-3 rounded-lg px-4 py-3 transition ${isActive("/profile/orderhistory")}`}
                        >
                            <Package size={20} />
                            Order History
                        </Link>
                    </li>

                </ul>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-10">
                <div className="max-w-3xl">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
export default ProfileLayout;