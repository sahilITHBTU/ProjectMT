import { forwardRef } from "react";

const Input = forwardRef(function Input(
  { label, error, icon: Icon, className = "", containerClassName = "", ...props },
  ref,
) {
  return (
    <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label className="text-[13px] font-semibold text-slate-600">{label}</label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <Icon size={17} className="absolute left-3.5 text-slate-400 pointer-events-none" />
        )}
        <input
          ref={ref}
          className={`w-full rounded-xl border bg-slate-50/60 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 ${
            Icon ? "pl-11 pr-4" : "px-4"
          } ${error ? "border-red-300" : "border-slate-200"} ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs font-medium text-red-500">{error}</span>}
    </div>
  );
});

export default Input;
