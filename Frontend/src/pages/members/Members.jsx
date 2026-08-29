import { useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Users } from "lucide-react";
import { useMembers } from "../../hooks/useMembers";
import { useProject } from "../../hooks/useProject";
import ProjectTabs from "../../components/layout/ProjectTabs";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Badge from "../../components/ui/Badge";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import PermissionGate from "../../components/auth/PermissionGate";
import { ROLES, ROLE_LABELS, AVAILABLE_ROLES } from "../../constants/roles";
import { initials } from "../../utils/formatters";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  role: z.enum(AVAILABLE_ROLES),
});

export default function Members() {
  const { projectId } = useParams();
  const { project } = useProject(projectId);
  const { members, isLoading, addMember, updateRole, removeMember } = useMembers(projectId);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { role: ROLES.MEMBER } });

  const onInvite = async (values) => {
    await addMember.mutateAsync(values);
    reset();
    setInviteOpen(false);
  };

  const onRemove = async () => {
    await removeMember.mutateAsync(removeTarget.user._id);
    setRemoveTarget(null);
  };

  const isAdmin = project?.role === ROLES.ADMIN;

  return (
    <div>
      <ProjectTabs project={project} projectId={projectId} />

      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-slate-400">
          {members.length} member{members.length !== 1 && "s"}
        </p>
        <PermissionGate role={project?.role} allow={[ROLES.ADMIN]}>
          <Button icon={Plus} onClick={() => setInviteOpen(true)}>
            Invite Member
          </Button>
        </PermissionGate>
      </div>

      {isLoading ? (
        <Loader />
      ) : members.length === 0 ? (
        <Card className="text-center py-16 flex flex-col items-center gap-3">
          <Users size={26} className="text-slate-300" />
          <p className="text-sm text-slate-400">No members yet.</p>
        </Card>
      ) : (
        <Card padded={false} className="overflow-hidden">
          <ul className="divide-y divide-slate-50">
            {members.map((m) => (
              <li key={m.user?._id} className="flex items-center justify-between gap-4 px-6 py-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 shrink-0">
                    {initials(m.user?.fullName || m.user?.username || "U")}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">
                      {m.user?.fullName || m.user?.username}
                    </p>
                    <p className="text-xs text-slate-400 truncate">@{m.user?.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {isAdmin ? (
                    <Select
                      value={m.role}
                      onChange={(e) =>
                        updateRole.mutate({ userId: m.user?._id, newRole: e.target.value })
                      }
                      options={AVAILABLE_ROLES.map((r) => ({ value: r, label: ROLE_LABELS[r] }))}
                      className="!py-2 !text-xs"
                    />
                  ) : (
                    <Badge variant={m.role}>{ROLE_LABELS[m.role]}</Badge>
                  )}
                  <PermissionGate role={project?.role} allow={[ROLES.ADMIN]}>
                    <button
                      onClick={() => setRemoveTarget(m)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </PermissionGate>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Modal open={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite Member">
        <form onSubmit={handleSubmit(onInvite)} className="flex flex-col gap-4">
          <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
          <Select
            label="Role"
            options={AVAILABLE_ROLES.map((r) => ({ value: r, label: ROLE_LABELS[r] }))}
            error={errors.role?.message}
            {...register("role")}
          />
          <div className="flex justify-end gap-2.5 mt-1">
            <Button variant="outline" type="button" onClick={() => setInviteOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Invite
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={onRemove}
        title="Remove member"
        description={`Remove ${removeTarget?.user?.username} from this project?`}
        confirmText="Remove"
      />
    </div>
  );
}
