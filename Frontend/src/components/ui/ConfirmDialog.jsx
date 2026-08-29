import Modal from "./Modal";
import Button from "./Button";
import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  loading = false,
  danger = true,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col gap-5">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-red-50 text-red-500 shrink-0">
            <AlertTriangle size={18} />
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
        </div>
        <div className="flex justify-end gap-2.5">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={danger ? "danger" : "primary"}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
