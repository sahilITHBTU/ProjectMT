import { Menu, Bell } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth();

  const resolveGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good morning";
    if (hours < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <header className="w-full bg-white/60 backdrop-blur-md border-b border-slate-100 sticky top-0 z-20 px-6 py-4 flex items-center justify-between lg:px-8">
      {}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 text-slate-500 hover:bg-slate-50 rounded-xl lg:hidden transition-colors cursor-pointer"
        >
          <Menu size={20} />
        </button>
        <div className="hidden sm:flex flex-col">
          <h2 className="text-[15px] font-bold text-slate-800 tracking-tight">
            {resolveGreeting()}, {user?.username || "User"}
          </h2>
          <span className="text-xs font-medium text-slate-400">
            Here's what is happening with your workspace today.
          </span>
        </div>
      </div>

      {}
      <div className="flex items-center gap-3">
        <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer relative">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-slate-950 rounded-full border border-white" />
        </button>
        <div className="w-px h-6 bg-slate-100 mx-1" />
        <div className="flex items-center gap-2.5 pl-1">
          <div className="w-8 h-8 rounded-full bg-slate-950 text-white flex items-center justify-center text-xs font-bold uppercase shadow-sm">
            {user?.username?.substring(0, 1) || "U"}
          </div>
        </div>
      </div>
    </header>
  );
}
