import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  X,
  LayoutDashboard,
  FolderKanban,
  Settings as SettingsIcon,
  Activity,
  LogOut,
} from "lucide-react";

export default function MobileNavbar({ isOpen, onClose, currentPath }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", path: "/projects", icon: FolderKanban },
    { name: "Settings", path: "/settings", icon: SettingsIcon },
    { name: "Health", path: "/health", icon: Activity },
  ];

  const handleLogout = async () => {
    onClose();
    await logout();
    navigate("/login");
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {}
      <div
        className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {}
      <div className="relative w-full max-w-xs bg-white h-full p-6 flex flex-col justify-between shadow-xl z-10 animate-slide-in">
        <div className="flex flex-col">
          {}
          <div className="flex items-center justify-between mb-8">
            <span className="font-bold text-lg tracking-tight text-slate-800">
              ProjectMT
            </span>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {}
          <nav className="flex flex-col gap-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                currentPath === item.path ||
                currentPath.startsWith(`${item.path}/`);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-semibold text-[14px] transition-colors ${
                    isActive
                      ? "bg-slate-950 text-white"
                      : "text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3.5 text-slate-400 hover:text-red-600 rounded-xl text-[14px] font-semibold transition-colors cursor-pointer"
        >
          <LogOut size={16} />
          Terminate Session
        </button>
      </div>
    </div>
  );
}
