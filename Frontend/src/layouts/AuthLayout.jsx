import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 px-4 py-10">
      {}
      <svg
        className="absolute -top-10 -right-10 w-[520px] h-[420px] text-slate-300/50 pointer-events-none hidden sm:block"
        viewBox="0 0 520 420"
        fill="none"
      >
        <path d="M60 420 L520 20" stroke="currentColor" strokeWidth="1.5" />
        <path d="M140 420 L520 100" stroke="currentColor" strokeWidth="1.5" />
        <path d="M220 420 L520 180" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <div className="absolute top-24 -left-16 w-72 h-72 rounded-full bg-slate-300/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-slate-400/10 blur-3xl pointer-events-none" />

      {}
      <div className="relative w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[28px] shadow-[0_20px_60px_-15px_rgba(15,23,42,0.15)] border border-white/60 px-8 py-10 sm:px-10 animate-fade-in">
        <Outlet />
      </div>

      {}
      <div className="fixed bottom-5 left-5 w-9 h-9 rounded-full bg-slate-950 text-white flex items-center justify-center font-bold text-sm shadow-lg select-none">
        P
      </div>
    </div>
  );
}
