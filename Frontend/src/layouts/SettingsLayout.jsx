import { NavLink, Outlet } from "react-router-dom";
import { User, SlidersHorizontal } from "lucide-react";

const tabs = [
  { label: "Profile", path: "/settings/profile", icon: User },
  { label: "Preferences", path: "/settings", icon: SlidersHorizontal, end: true },
];

export default function SettingsLayout() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your account preferences and profile details.
        </p>
      </div>

      <div className="flex gap-2 border-b border-slate-100">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.end}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                isActive
                  ? "border-slate-950 text-slate-900"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`
            }
          >
            <tab.icon size={15} />
            {tab.label}
          </NavLink>
        ))}
      </div>

      <Outlet />
    </div>
  );
}
