import { forwardRef } from "react";

const Textarea = forwardRef(function Textarea(
  { label, error, className = "", containerClassName = "", rows = 4, ...props },
  ref,
) {
  return (
    <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label className="text-[13px] font-semibold text-slate-600">{label}</label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`w-full rounded-xl border bg-slate-50/60 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 resize-none ${
          error ? "border-red-300" : "border-slate-200"
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs font-medium text-red-500">{error}</span>}
    </div>
  );
});

export default Textarea;
