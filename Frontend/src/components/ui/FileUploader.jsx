import { useRef, useState } from "react";
import { UploadCloud, X, Paperclip } from "lucide-react";
import { formatBytes } from "../../utils/formatters";

export default function FileUploader({ files = [], onChange, maxFiles = 5 }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const addFiles = (fileList) => {
    const incoming = Array.from(fileList).slice(0, maxFiles - files.length);
    onChange?.([...files, ...incoming]);
  };

  const removeFile = (index) => {
    onChange?.(files.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          addFiles(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center cursor-pointer transition-colors ${
          dragOver ? "border-slate-400 bg-slate-50" : "border-slate-200 hover:bg-slate-50"
        }`}
      >
        <UploadCloud size={22} className="text-slate-400" />
        <p className="text-sm font-semibold text-slate-600">
          Click to upload or drag & drop
        </p>
        <p className="text-xs text-slate-400">Up to {maxFiles} files</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <ul className="flex flex-col gap-2">
          {files.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 border border-slate-100 px-3 py-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Paperclip size={14} className="text-slate-400 shrink-0" />
                <span className="text-xs font-medium text-slate-600 truncate">
                  {file.name}
                </span>
                <span className="text-[11px] text-slate-400 shrink-0">
                  {formatBytes(file.size)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="text-slate-400 hover:text-red-500 cursor-pointer shrink-0"
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
