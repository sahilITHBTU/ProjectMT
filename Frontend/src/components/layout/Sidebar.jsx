import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  LayoutDashboard,
  FolderKanban,
  Settings as SettingsIcon,
  Activity,
  LogOut,
  Shield,
} from "lucide-react";

export default function Sidebar({ currentPath }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const navigationItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", path: "/projects", icon: FolderKanban },
    { name: "Settings", path: "/settings", icon: SettingsIcon },
    { name: "Health", path: "/health", icon: Activity },
  ];

  const handleLogoutClick = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-100 hidden lg:flex flex-col z-30 p-6 justify-between">
      <div className="w-full flex flex-col">
        {}
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-lg">
            P
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-800">
            ProjectMT
          </span>
        </div>

        {}
        <nav className="w-full flex flex-col gap-1.5">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentPath === item.path ||
              currentPath.startsWith(`${item.path}/`);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-semibold text-[14px] transition-all duration-200 group cursor-pointer ${
                  isActive
                    ? "bg-slate-950 text-white shadow-sm"
                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {}
      <div className="w-full flex flex-col gap-4 border-t border-slate-100 pt-5 px-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200/60 flex items-center justify-center font-bold text-slate-700 uppercase">
            {user?.username?.substring(0, 2) || "U"}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-slate-800 truncate">
              {user?.username}
            </span>
            <span className="text-xs font-medium text-slate-400 truncate flex items-center gap-1">
              <Shield size={10} /> {user?.role || "member"}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogoutClick}
          className="w-full flex items-center gap-3 px-3 py-3 text-slate-400 hover:text-red-600 rounded-xl text-[13px] font-semibold transition-colors cursor-pointer group"
        >
          <LogOut
            size={16}
            strokeWidth={1.8}
            className="group-hover:translate-x-0.5 transition-transform"
          />
          Terminate Session
        </button>
      </div>
    </aside>
  );
}
