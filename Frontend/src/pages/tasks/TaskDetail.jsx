import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Trash2,
  Plus,
  Paperclip,
  CheckSquare,
  MessageSquare,
} from "lucide-react";
import { useTask, useTasks } from "../../hooks/useTasks";
import { useSubTasks } from "../../hooks/useSubTasks";
import { useTaskComments } from "../../hooks/useTaskComments";
import { useMembers } from "../../hooks/useMembers";
import { useProject } from "../../hooks/useProject";
import { useAuth } from "../../hooks/useAuth";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Select from "../../components/ui/Select";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import FileUploader from "../../components/ui/FileUploader";
import AttachmentCard from "../../components/ui/AttachmentCard";
import PermissionGate from "../../components/auth/PermissionGate";
import { ROLES } from "../../constants/roles";
import {
  TASK_STATUS_LABELS,
  AVAILABLE_TASK_STATUSES,
} from "../../constants/status";
import { formatDateTime, timeAgo, initials } from "../../utils/formatters";

export default function TaskDetail() {
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { project } = useProject(projectId);
  const {
    task,
    isLoading,
    updateOwnStatus,
    updateOwnProgress,
    addOwnAttachments,
  } = useTask(projectId, taskId);
  const { updateTask, deleteTask } = useTasks(projectId);
  const { members } = useMembers(projectId);
  const { createSubTask, updateSubTask, deleteSubTask } = useSubTasks(
    projectId,
    taskId,
  );
  const { comments, addComment } = useTaskComments(projectId, taskId);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [newSubtask, setNewSubtask] = useState("");
  const [files, setFiles] = useState([]);
  const [progressInput, setProgressInput] = useState(null);
  const [noteText, setNoteText] = useState("");

  if (isLoading) return <Loader full />;
  if (!task) return null;

  const canManage = [ROLES.ADMIN, ROLES.PROJECT_ADMIN].includes(project?.role);
 
 
  const isAssignee = !!user?._id && task.assignedTo?._id === user._id;
  const canEditStatus = canManage || isAssignee;
  const canUpload = canManage || isAssignee;
  const progressValue = progressInput ?? task.progress ?? 0;

  const onStatusChange = (e) => {
    const status = e.target.value;
    if (canManage) {
      updateTask.mutate({ taskId, payload: { status } });
    } else if (isAssignee) {
      updateOwnStatus.mutate(status);
    }
  };

  const onAssigneeChange = (e) => {
    updateTask.mutate({ taskId, payload: { assignedTo: e.target.value } });
  };

  const onAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;
    createSubTask.mutate({ title: newSubtask });
    setNewSubtask("");
  };

  const onUploadFiles = async () => {
    if (files.length === 0) return;
    const formData = new FormData();
    files.forEach((f) => formData.append("attachemants", f));
    if (canManage) {
      await updateTask.mutateAsync({ taskId, payload: formData });
    } else if (isAssignee) {
      await addOwnAttachments.mutateAsync(formData);
    }
    setFiles([]);
  };

  const onSaveProgress = () => {
    const value = Math.max(0, Math.min(100, Number(progressValue) || 0));
    updateOwnProgress.mutate(value, {
      onSuccess: () => setProgressInput(null),
    });
  };

  const onAddNote = (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    addComment.mutate(noteText, { onSuccess: () => setNoteText("") });
  };

  const onDelete = async () => {
    await deleteTask.mutateAsync(taskId);
    navigate(`/projects/${projectId}/tasks`);
  };

  return (
    <div className="max-w-3xl">
      <Link
        to={`/projects/${projectId}/tasks`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-slate-800 mb-5 transition-colors"
      >
        <ArrowLeft size={15} /> Back to tasks
      </Link>

      <div className="flex items-start justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          {task.title}
        </h1>
        <PermissionGate
          role={project?.role}
          allow={[ROLES.ADMIN, ROLES.PROJECT_ADMIN]}
        >
          <Button
            variant="danger"
            size="sm"
            icon={Trash2}
            onClick={() => setDeleteOpen(true)}
          >
            Delete
          </Button>
        </PermissionGate>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col gap-6">
          <Card>
            <h2 className="font-bold text-slate-800 mb-2 text-sm">
              Description
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              {task.description || "No description provided."}
            </p>
          </Card>

          <Card>
            <h2 className="font-bold text-slate-800 mb-4 text-sm flex items-center gap-2">
              <CheckSquare size={15} /> Subtasks
            </h2>
            <div className="flex flex-col gap-2 mb-4">
              {(task.subtasks || []).map((st) => (
                <label
                  key={st._id}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-50/70 border border-slate-100 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={st.isCompleted}
                    onChange={(e) =>
                      updateSubTask.mutate({
                        subTaskId: st._id,
                        payload: { isCompleted: e.target.checked },
                      })
                    }
                    className="w-4 h-4 rounded accent-slate-950"
                  />
                  <span
                    className={`flex-1 text-sm font-medium ${
                      st.isCompleted
                        ? "line-through text-slate-300"
                        : "text-slate-700"
                    }`}
                  >
                    {st.title}
                  </span>
                  {canManage && (
                    <button
                      onClick={() => deleteSubTask.mutate(st._id)}
                      className="text-slate-300 hover:text-red-500 cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </label>
              ))}
              {(task.subtasks || []).length === 0 && (
                <p className="text-xs text-slate-400 py-2">No subtasks yet.</p>
              )}
            </div>
            {canManage && (
              <form onSubmit={onAddSubtask} className="flex gap-2">
                <Input
                  placeholder="Add a subtask..."
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  containerClassName="flex-1"
                />
                <Button type="submit" icon={Plus} size="md">
                  Add
                </Button>
              </form>
            )}
          </Card>

          <Card>
            <h2 className="font-bold text-slate-800 mb-4 text-sm flex items-center gap-2">
              <Paperclip size={15} /> Attachments
            </h2>
            <div className="flex flex-col gap-2 mb-4">
              {(task.attachemants || []).map((a, i) => (
                <AttachmentCard key={i} attachment={a} />
              ))}
              {(task.attachemants || []).length === 0 && (
                <p className="text-xs text-slate-400">No files attached.</p>
              )}
            </div>
            {canUpload && (
              <div className="flex flex-col gap-3">
                <FileUploader files={files} onChange={setFiles} />
                {files.length > 0 && (
                  <Button
                    size="sm"
                    onClick={onUploadFiles}
                    loading={
                      updateTask.isPending || addOwnAttachments.isPending
                    }
                  >
                    Upload {files.length} file{files.length > 1 && "s"}
                  </Button>
                )}
              </div>
            )}
          </Card>

          <Card>
            <h2 className="font-bold text-slate-800 mb-4 text-sm flex items-center gap-2">
              <MessageSquare size={15} /> Progress notes
            </h2>
            <div className="flex flex-col gap-3 mb-4">
              {comments.map((c) => (
                <div
                  key={c._id}
                  className="flex gap-3 px-3.5 py-2.5 rounded-xl bg-slate-50/70 border border-slate-100"
                >
                  <div className="w-7 h-7 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                    {initials(
                      c.createdBy?.fullName || c.createdBy?.username || "?",
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold text-slate-700">
                        {c.createdBy?.fullName || c.createdBy?.username}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {timeAgo(c.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 whitespace-pre-wrap break-words">
                      {c.content}
                    </p>
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-xs text-slate-400">No progress notes yet.</p>
              )}
            </div>
            {isAssignee && (
              <form onSubmit={onAddNote} className="flex flex-col gap-2">
                <Textarea
                  placeholder="Share a quick update on your progress..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  rows={2}
                />
                <Button
                  type="submit"
                  size="sm"
                  icon={Plus}
                  loading={addComment.isPending}
                  className="self-end"
                >
                  Post note
                </Button>
              </form>
            )}
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="flex flex-col gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 mb-1.5">
                Status
              </p>
              {canEditStatus ? (
                <Select
                  value={task.status}
                  onChange={onStatusChange}
                  options={AVAILABLE_TASK_STATUSES.map((s) => ({
                    value: s,
                    label: TASK_STATUS_LABELS[s],
                  }))}
                />
              ) : (
                <Badge variant={task.status}>
                  {TASK_STATUS_LABELS[task.status]}
                </Badge>
              )}
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400 mb-1.5">
                Progress
              </p>
              {isAssignee ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={progressValue}
                    onChange={(e) => setProgressInput(e.target.value)}
                    containerClassName="flex-1"
                  />
                  <span className="text-sm font-semibold text-slate-400">
                    %
                  </span>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={onSaveProgress}
                    loading={updateOwnProgress.isPending}
                    disabled={progressInput === null}
                  >
                    Save
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-slate-900 rounded-full"
                      style={{ width: `${task.progress || 0}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    {task.progress || 0}%
                  </span>
                </div>
              )}
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400 mb-1.5">
                Assignee
              </p>
              {canManage ? (
                <Select
                  value={task.assignedTo?._id || ""}
                  onChange={onAssigneeChange}
                  options={members.map((m) => ({
                    value: m.user?._id,
                    label: m.user?.fullName || m.user?.username,
                  }))}
                />
              ) : (
                <p className="text-sm font-semibold text-slate-700">
                  {task.assignedTo?.fullName ||
                    task.assignedTo?.username ||
                    "Unassigned"}
                </p>
              )}
            </div>
            <div className="pt-3 border-t border-slate-50 text-xs text-slate-400">
              Created {formatDateTime(task.createdAt)}
            </div>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={onDelete}
        title="Delete task"
        description="This will permanently delete this task and its subtasks."
        confirmText="Delete"
      />
    </div>
  );
}
