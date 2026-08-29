
const variants = {
  default: "bg-slate-100 text-slate-600",
  admin: "bg-slate-950 text-white",
  project_admin: "bg-indigo-100 text-indigo-700",
  member: "bg-slate-100 text-slate-600",
  todo: "bg-slate-100 text-slate-600",
  in_progress: "bg-amber-100 text-amber-700",
  done: "bg-emerald-100 text-emerald-700",
  success: "bg-emerald-100 text-emerald-700",
  danger: "bg-red-100 text-red-600",
};

export default function Badge({ children, variant = "default", className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${
        variants[variant] || variants.default
      } ${className}`}
    >
      {children}
    </span>
  );
}
