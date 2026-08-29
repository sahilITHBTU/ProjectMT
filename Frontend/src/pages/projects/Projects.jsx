import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Users, Trash2, FolderKanban } from "lucide-react";
import { useProjects } from "../../hooks/useProjects";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import { formatDate } from "../../utils/formatters";
import { ROLE_LABELS } from "../../constants/roles";
import Badge from "../../components/ui/Badge";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export default function Projects() {
  const { projects, isLoading, createProject, deleteProject } = useProjects();
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onCreate = async (values) => {
    await createProject.mutateAsync(values);
    reset();
    setCreateOpen(false);
  };

  const onDelete = async () => {
    await deleteProject.mutateAsync(deleteTarget._id);
    setDeleteTarget(null);
  };

  if (isLoading) return <Loader full />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Projects
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {projects.length} project{projects.length !== 1 && "s"} in your
            workspace.
          </p>
        </div>
        <Button icon={Plus} onClick={() => setCreateOpen(true)}>
          New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card className="text-center py-20 flex flex-col items-center gap-3">
          <FolderKanban size={28} className="text-slate-300" />
          <p className="text-sm text-slate-400">No projects yet.</p>
          <Button size="sm" icon={Plus} onClick={() => setCreateOpen(true)}>
            Create your first project
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card
              key={project._id}
              className="flex flex-col gap-3 group relative"
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setDeleteTarget(project);
                }}
                className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
              >
                <Trash2 size={14} />
              </button>
              <Link
                to={`/projects/${project._id}`}
                className="flex flex-col gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center font-bold">
                  {project.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2 pr-6">
                    <h3 className="font-bold text-slate-800 truncate">
                      {project.name}
                    </h3>
                    {project.role && (
                      <Badge variant={project.role} className="shrink-0">
                        {ROLE_LABELS[project.role]}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 min-h-[32px]">
                    {project.description || "No description"}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                    <Users size={12} /> {project.membersCount || 0} members
                  </span>
                  <span className="text-[11px] text-slate-300">
                    {formatDate(project.createdAt)}
                  </span>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create Project"
      >
        <form onSubmit={handleSubmit(onCreate)} className="flex flex-col gap-4">
          <Input
            label="Name"
            placeholder="e.g. Marketing Website"
            error={errors.name?.message}
            {...register("name")}
          />
          <Textarea
            label="Description"
            placeholder="What's this project about?"
            error={errors.description?.message}
            {...register("description")}
          />
          <div className="flex justify-end gap-2.5 mt-1">
            <Button
              variant="outline"
              type="button"
              onClick={() => setCreateOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Create
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={onDelete}
        title="Delete project"
        description={`This will permanently delete "${deleteTarget?.name}" and all its tasks and notes.`}
        confirmText="Delete"
        loading={deleteProject.isPending}
      />
    </div>
  );
}
