export const TASK_STATUS = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  DONE: "done",
};

export const TASK_STATUS_LABELS = {
  [TASK_STATUS.TODO]: "To Do",
  [TASK_STATUS.IN_PROGRESS]: "In Progress",
  [TASK_STATUS.DONE]: "Done",
};

export const TASK_STATUS_COLORS = {
  [TASK_STATUS.TODO]: "bg-slate-100 text-slate-600",
  [TASK_STATUS.IN_PROGRESS]: "bg-amber-100 text-amber-700",
  [TASK_STATUS.DONE]: "bg-emerald-100 text-emerald-700",
};

export const AVAILABLE_TASK_STATUSES = Object.values(TASK_STATUS);
