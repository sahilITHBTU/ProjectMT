import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import MobileNavbar from "../components/layout/MobileNavbar";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen w-screen bg-slate-50/50 flex text-slate-800 antialiased overflow-x-hidden">
      {}
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        currentPath={location.pathname}
      />

      {}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen lg:pl-72">
        {}
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        {}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>

      {}
      <MobileNavbar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPath={location.pathname}
      />
    </div>
  );
}
