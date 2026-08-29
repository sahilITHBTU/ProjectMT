import { Loader2 } from "lucide-react";

export default function Loader({ full = false, label = "Loading..." }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 text-slate-400 ${
        full ? "min-h-[60vh]" : "py-16"
      }`}
    >
      <Loader2 size={26} className="animate-spin" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
