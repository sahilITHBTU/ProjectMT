import { Loader2 } from "lucide-react";

const variants = {
  primary: "bg-slate-950 text-white hover:bg-slate-800 shadow-sm",
  secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
  outline: "border border-slate-200 text-slate-700 hover:bg-slate-50",
  danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
  ghost: "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
};

const sizes = {
  sm: "px-3 py-2 text-[13px]",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3.5 text-[15px]",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  icon: Icon,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        Icon && <Icon size={16} />
      )}
      {children}
    </button>
  );
}
