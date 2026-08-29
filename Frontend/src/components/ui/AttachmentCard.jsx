import { FileText, Download } from "lucide-react";
import { formatBytes } from "../../utils/formatters";

export default function AttachmentCard({ attachment }) {
  return (
    <a
      href={attachment.url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-3.5 py-3 hover:bg-slate-50 transition-colors group"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="p-2 rounded-lg bg-white border border-slate-100 text-slate-500 shrink-0">
          <FileText size={15} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-700 truncate">
            {attachment.mimetypes || "file"}
          </p>
          <p className="text-[11px] text-slate-400">{formatBytes(attachment.size)}</p>
        </div>
      </div>
      <Download
        size={15}
        className="text-slate-300 group-hover:text-slate-600 transition-colors shrink-0"
      />
    </a>
  );
}
