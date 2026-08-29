import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

const Select = forwardRef(function Select(
  { label, error, options = [], placeholder = "Select...", className = "", containerClassName = "", ...props },
  ref,
) {
  return (
    <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label className="text-[13px] font-semibold text-slate-600">{label}</label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={`w-full appearance-none rounded-xl border bg-slate-50/60 px-4 py-3 pr-10 text-sm text-slate-800 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 ${
            error ? "border-red-300" : "border-slate-200"
          } ${className}`}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
      </div>
      {error && <span className="text-xs font-medium text-red-500">{error}</span>}
    </div>
  );
});

export default Select;
