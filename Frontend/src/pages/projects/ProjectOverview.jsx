import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckSquare, StickyNote, Users, Pencil, Trash2 } from "lucide-react";
import { useProject } from "../../hooks/useProject";
import { useProjects } from "../../hooks/useProjects";
import { useTasks } from "../../hooks/useTasks";
import { useNotes } from "../../hooks/useNotes";
import { useMembers } from "../../hooks/useMembers";
import ProjectTabs from "../../components/layout/ProjectTabs";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import PermissionGate from "../../components/auth/PermissionGate";
import { ROLES } from "../../constants/roles";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export default function ProjectOverview() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { project, isLoading, updateProject } = useProject(projectId);
  const { deleteProject } = useProjects();
  const { tasks } = useTasks(projectId);
  const { notes } = useNotes(projectId);
  const { members } = useMembers(projectId);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    values: { name: project?.name || "", description: project?.description || "" },
  });

  const onUpdate = async (values) => {
    await updateProject.mutateAsync(values);
    setEditOpen(false);
  };

  const onDelete = async () => {
    await deleteProject.mutateAsync(projectId);
    navigate("/projects");
  };

  if (isLoading) return <Loader full />;

  const summary = [
    { label: "Tasks", value: tasks.length, icon: CheckSquare, to: `/projects/${projectId}/tasks` },
    { label: "Notes", value: notes.length, icon: StickyNote, to: `/projects/${projectId}/notes` },
    { label: "Members", value: members.length, icon: Users, to: `/projects/${projectId}/members` },
  ];

  return (
    <div>
      <ProjectTabs project={project} projectId={projectId} />

      <div className="flex flex-col gap-6">
        <Card className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-bold text-slate-800 mb-1.5">Description</h2>
            <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">
              {project?.description || "No description provided for this project."}
            </p>
          </div>
          <PermissionGate role={project?.role} allow={[ROLES.ADMIN]}>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="sm" icon={Pencil} onClick={() => setEditOpen(true)}>
                Edit
              </Button>
              <Button variant="danger" size="sm" icon={Trash2} onClick={() => setDeleteOpen(true)}>
                Delete
              </Button>
            </div>
          </PermissionGate>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {summary.map((s) => (
            <Link key={s.label} to={s.to}>
              <Card className="flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="p-3 rounded-xl bg-slate-950 text-white">
                  <s.icon size={18} />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-slate-900">{s.value}</p>
                  <p className="text-xs font-semibold text-slate-400">{s.label}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Project">
        <form onSubmit={handleSubmit(onUpdate)} className="flex flex-col gap-4">
          <Input label="Name" error={errors.name?.message} {...register("name")} />
          <Textarea label="Description" error={errors.description?.message} {...register("description")} />
          <div className="flex justify-end gap-2.5 mt-1">
            <Button variant="outline" type="button" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Save
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={onDelete}
        title="Delete project"
        description={`This will permanently delete "${project?.name}" and all its tasks and notes.`}
        confirmText="Delete"
      />
    </div>
  );
}
