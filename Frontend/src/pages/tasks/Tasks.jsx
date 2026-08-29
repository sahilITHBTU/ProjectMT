import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, CheckSquare, UserRound } from "lucide-react";
import { useTasks } from "../../hooks/useTasks";
import { useMembers } from "../../hooks/useMembers";
import { useProject } from "../../hooks/useProject";
import ProjectTabs from "../../components/layout/ProjectTabs";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Select from "../../components/ui/Select";
import Badge from "../../components/ui/Badge";
import PermissionGate from "../../components/auth/PermissionGate";
import { ROLES } from "../../constants/roles";
import { TASK_STATUS_LABELS, AVAILABLE_TASK_STATUSES } from "../../constants/status";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  assignedTo: z.string().optional(),
  status: z.string().optional(),
});

export default function Tasks() {
  const { projectId } = useParams();
  const { project } = useProject(projectId);
  const { tasks, isLoading, createTask } = useTasks(projectId);
  const { members } = useMembers(projectId);
  const [createOpen, setCreateOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onCreate = async (values) => {
    await createTask.mutateAsync(values);
    reset();
    setCreateOpen(false);
  };

  const memberOptions = members.map((m) => ({
    value: m.user?._id,
    label: m.user?.fullName || m.user?.username,
  }));

  const grouped = AVAILABLE_TASK_STATUSES.map((status) => ({
    status,
    items: tasks.filter((t) => t.status === status),
  }));

  return (
    <div>
      <ProjectTabs project={project} projectId={projectId} />

      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-slate-400">
          {tasks.length} task{tasks.length !== 1 && "s"} in this project
        </p>
        <PermissionGate role={project?.role} allow={[ROLES.ADMIN, ROLES.PROJECT_ADMIN]}>
          <Button icon={Plus} onClick={() => setCreateOpen(true)}>
            New Task
          </Button>
        </PermissionGate>
      </div>

      {isLoading ? (
        <Loader />
      ) : tasks.length === 0 ? (
        <Card className="text-center py-16 flex flex-col items-center gap-3">
          <CheckSquare size={26} className="text-slate-300" />
          <p className="text-sm text-slate-400">No tasks yet.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {grouped.map((col) => (
            <div key={col.status} className="flex flex-col gap-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-bold text-slate-700">
                  {TASK_STATUS_LABELS[col.status]}
                </h3>
                <span className="text-xs font-semibold text-slate-300">{col.items.length}</span>
              </div>
              <div className="flex flex-col gap-3">
                {col.items.map((task) => (
                  <Link key={task._id} to={`/projects/${projectId}/tasks/${task._id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <h4 className="font-semibold text-slate-800 text-sm mb-1.5">
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <Badge variant={task.status}>{TASK_STATUS_LABELS[task.status]}</Badge>
                        {task.assignedTo && (
                          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                            <UserRound size={12} />
                            {task.assignedTo.username || task.assignedTo.fullName}
                          </span>
                        )}
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Task">
        <form onSubmit={handleSubmit(onCreate)} className="flex flex-col gap-4">
          <Input label="Title" error={errors.title?.message} {...register("title")} />
          <Textarea label="Description" error={errors.description?.message} {...register("description")} />
          <Select
            label="Assign To"
            options={memberOptions}
            error={errors.assignedTo?.message}
            {...register("assignedTo")}
          />
          <Select
            label="Status"
            options={AVAILABLE_TASK_STATUSES.map((s) => ({ value: s, label: TASK_STATUS_LABELS[s] }))}
            error={errors.status?.message}
            {...register("status")}
          />
          <div className="flex justify-end gap-2.5 mt-1">
            <Button variant="outline" type="button" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Create
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
