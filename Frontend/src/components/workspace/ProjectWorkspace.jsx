import { useState, useRef, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Check, Send, Loader2, Lock, Pencil, Users2 } from "lucide-react";
import { useProject } from "../../hooks/useProject";
import { useMembers } from "../../hooks/useMembers";
import { useTasks, useTask } from "../../hooks/useTasks";
import { useSubTasks } from "../../hooks/useSubTasks";
import { useNotes } from "../../hooks/useNotes";
import ProjectTabs from "../layout/ProjectTabs";
import Loader from "../ui/Loader";
import { ROLES } from "../../constants/roles";


const T = {
  bg: "#F8FAFC",
  surface: "rgba(255,255,255,0.85)",
  raised: "#F8FAFC",
  border: "#E2E8F0",
  borderSoft: "#F1F5F9",
  text: "#0F172A",
  dim: "#64748B",
  faint: "#94A3B8",
  primary: "#020617",
  amber: "#D97706",
  amberSoft: "#FEF3C7",
  teal: "#059669",
  tealSoft: "#D1FAE5",
  violet: "#6366F1",
  violetSoft: "#E0E7FF",
};

const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";

const KEYFRAMES = `
@keyframes breathe {
  0%, 100% { box-shadow: 0 0 0 1px ${T.amber}40, 0 0 16px 0 ${T.amber}1f; }
  50%      { box-shadow: 0 0 0 1px ${T.amber}80, 0 0 22px 3px ${T.amber}33; }
}
@keyframes pop-in {
  0%   { transform: scale(0.2); opacity: 0; }
  60%  { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes fly-out {
  0%   { transform: translateX(0) translateY(0); opacity: 1; }
  100% { transform: translateX(10px) translateY(-2px); opacity: 0.92; }
}
@keyframes assign-bounce {
  0%   { transform: translateY(0); }
  40%  { transform: translateY(4px); }
  100% { transform: translateY(0); }
}
@keyframes fade-up {
  0%   { opacity: 0; transform: translateY(3px); }
  100% { opacity: 1; transform: translateY(0); }
}
`;


function Corner({ pos }) {
  const base = { position: "absolute", width: 10, height: 10, opacity: 0.7 };
  const styles = {
    tl: {
      ...base,
      top: -1,
      left: -1,
      borderTop: `1.5px solid ${T.border}`,
      borderLeft: `1.5px solid ${T.border}`,
    },
    tr: {
      ...base,
      top: -1,
      right: -1,
      borderTop: `1.5px solid ${T.border}`,
      borderRight: `1.5px solid ${T.border}`,
    },
    bl: {
      ...base,
      bottom: -1,
      left: -1,
      borderBottom: `1.5px solid ${T.border}`,
      borderLeft: `1.5px solid ${T.border}`,
    },
    br: {
      ...base,
      bottom: -1,
      right: -1,
      borderBottom: `1.5px solid ${T.border}`,
      borderRight: `1.5px solid ${T.border}`,
    },
  };
  return <div style={styles[pos]} />;
}

function Panel({ label, accent, children }) {
  return (
    <section
      className="relative rounded-2xl p-6"
      style={{
        background: T.surface,
        border: `1px solid ${T.borderSoft}`,
        boxShadow:
          "0 1px 2px 0 rgba(15,23,42,0.04), 0 12px 30px -18px rgba(15,23,42,0.12)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <Corner pos="tl" />
      <Corner pos="tr" />
      <Corner pos="bl" />
      <Corner pos="br" />
      <div className="flex items-center gap-2 mb-5">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: accent, boxShadow: `0 0 6px 1px ${accent}55` }}
        />
        <span
          className="font-mono text-[11px] uppercase tracking-widest"
          style={{ color: T.faint, letterSpacing: "0.18em" }}
        >
          {label}
        </span>
      </div>
      {children}
    </section>
  );
}


function InviteConsole({ projectId, canInvite }) {
  const { inviteMember } = useMembers(projectId);
  const [email, setEmail] = useState("");

  const [result, setResult] = useState(null);
  const revertTimer = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inviteMember.isPending || !email.trim()) return;
    try {
      const res = await inviteMember.mutateAsync({ email: email.trim() });
      const status =
        res?.data?.data?.status === "joined" ? "joined" : "invited";
      setResult(status);
      clearTimeout(revertTimer.current);
      revertTimer.current = setTimeout(() => {
        setResult(null);
        setEmail("");
      }, 3000);
    } catch {}
  };

  const isDone = result === "joined" || result === "invited";

  if (!canInvite) {
    return (
      <Panel
        label="Mod. Invite — bring someone into this project"
        accent={T.faint}
      >
        <p className="text-sm" style={{ color: T.dim }}>
          Only project admins can invite new members.
        </p>
      </Panel>
    );
  }

  return (
    <Panel
      label="Mod. Invite — bring someone into this project"
      accent={T.violet}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <input
            type="email"
            required
            disabled={isDone || inviteMember.isPending}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="teammate@company.com"
            className="flex-1 h-11 px-4 rounded-xl text-sm outline-none transition-all duration-200"
            style={{
              background: "#F8FAFC",
              border: `1px solid ${T.border}`,
              color: T.text,
              opacity: isDone ? 0.5 : 1,
            }}
            onFocus={(e) => {
              e.target.style.borderColor = T.violet;
              e.target.style.background = "#FFFFFF";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = T.border;
              e.target.style.background = "#F8FAFC";
            }}
          />

          {}
          <button
            type="submit"
            disabled={inviteMember.isPending || isDone}
            className="relative inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full font-mono text-[12.5px] tracking-wide transition-all duration-300 shrink-0"
            style={{
              transitionTimingFunction: SPRING,
              minWidth: 172,
              cursor: inviteMember.isPending
                ? "wait"
                : isDone
                  ? "default"
                  : "pointer",
              background:
                result === "joined"
                  ? T.tealSoft
                  : result === "invited"
                    ? T.violetSoft
                    : T.primary,
              color:
                result === "joined"
                  ? "#065F46"
                  : result === "invited"
                    ? "#4338CA"
                    : "#FFFFFF",
              border:
                result === "joined"
                  ? `1px solid #A7F3D0`
                  : result === "invited"
                    ? `1px solid #C7D2FE`
                    : `1px solid ${T.primary}`,
              boxShadow: isDone ? "none" : "0 1px 2px rgba(15,23,42,0.15)",
            }}
          >
            {!result && !inviteMember.isPending && <span>Send invite</span>}

            {inviteMember.isPending && (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Sending…</span>
              </>
            )}

            {result === "joined" && (
              <span key="joined" className="inline-flex items-center gap-2">
                <Check
                  size={15}
                  strokeWidth={3}
                  style={{ animation: "pop-in 320ms " + SPRING + " both" }}
                />
                <span>User joined</span>
              </span>
            )}

            {result === "invited" && (
              <span key="invited" className="inline-flex items-center gap-2">
                <span>Invite dispatched</span>
                <Send
                  size={14}
                  style={{ animation: "fly-out 320ms ease-out 40ms both" }}
                />
              </span>
            )}
          </button>
        </div>
        <p className="font-mono text-[11px]" style={{ color: T.faint }}>
          If the email already has an account they're added right away;
          otherwise a 7-day invitation is created for them.
        </p>
      </form>
    </Panel>
  );
}


function Avatar({
  member,
  size = 32,
  dimmed = false,
  dragging = false,
  color,
  ...rest
}) {
  const label = member.fullName || member.username || "?";
  const initials = label
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      {...rest}
      title={label}
      className="rounded-full flex items-center justify-center font-mono font-semibold shrink-0 transition-all duration-200"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: `${color}1A`,
        color,
        border: `1.5px solid ${color}`,
        opacity: dimmed ? 0.35 : 1,
        cursor: "grab",
        transform: dragging ? "scale(1.08)" : "scale(1)",
      }}
    >
      {initials}
    </div>
  );
}

const AVATAR_PALETTE = [
  T.teal,
  T.amber,
  T.violet,
  "#DB2777",
  "#0284C7",
  "#9333EA",
];

function TaskCard({
  projectId,
  task,
  colorFor,
  onAssign,
  canManage,
  selectedMember,
  bouncing,
}) {
  const { task: fullTask } = useTask(projectId, task._id);
  const { updateSubTask } = useSubTasks(projectId, task._id);
  const [dragOver, setDragOver] = useState(false);

  const subtasks = fullTask?.subtasks ?? [];
  const total = subtasks.length;
  const done = subtasks.filter((s) => s.isCompleted).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div
      onDragOver={(e) => {
        if (!canManage) return;
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        if (!canManage) return;
        e.preventDefault();
        setDragOver(false);
        const memberId = e.dataTransfer.getData("text/member-id");
        if (memberId) onAssign(task._id, memberId);
      }}
      onClick={() =>
        canManage && selectedMember && onAssign(task._id, selectedMember)
      }
      className="rounded-xl p-4 transition-all duration-200"
      style={{
        background: "#FFFFFF",
        border: `1px solid ${dragOver ? T.violet : T.border}`,
        boxShadow: dragOver
          ? "0 0 0 3px rgba(99,102,241,0.12)"
          : "0 1px 2px rgba(15,23,42,0.04)",
        animation: bouncing ? "assign-bounce 220ms ease-in-out" : "none",
        cursor: canManage && selectedMember ? "pointer" : "default",
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h4 className="text-sm font-semibold" style={{ color: T.text }}>
          {task.title}
        </h4>
        {task.assignedTo ? (
          <Avatar
            member={task.assignedTo}
            size={26}
            color={colorFor(task.assignedTo._id)}
          />
        ) : (
          <div
            className="h-[26px] w-[26px] rounded-full flex items-center justify-center shrink-0 font-mono text-[10px]"
            style={{ border: `1.5px dashed ${T.border}`, color: T.faint }}
          >
            +
          </div>
        )}
      </div>

      <div className="space-y-1.5 mb-3">
        {subtasks.map((s) => (
          <label
            key={s._id}
            className="flex items-center gap-2 text-[13px] cursor-pointer group"
            style={{ color: s.isCompleted ? T.faint : T.dim }}
          >
            <input
              type="checkbox"
              checked={s.isCompleted}
              onChange={(e) =>
                updateSubTask.mutate({
                  subTaskId: s._id,
                  payload: { isCompleted: e.target.checked },
                })
              }
              className="h-3.5 w-3.5 rounded-sm accent-current shrink-0"
              style={{ accentColor: T.teal }}
            />
            <span
              style={{
                textDecoration: s.isCompleted ? "line-through" : "none",
              }}
            >
              {s.title}
            </span>
          </label>
        ))}
        {total === 0 && (
          <p className="font-mono text-[11px]" style={{ color: T.faint }}>
            No subtasks yet
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div
          className="h-1.5 flex-1 rounded-full overflow-hidden"
          style={{ background: T.borderSoft }}
        >
          <div
            className="h-full rounded-full transition-all duration-300 ease-in-out"
            style={{
              width: `${pct}%`,
              background: pct === 100 ? T.teal : T.violet,
            }}
          />
        </div>
        <span
          className="font-mono text-[10.5px] tabular-nums"
          style={{ color: T.faint }}
        >
          {done}/{total}
        </span>
      </div>
    </div>
  );
}

function TaskGridConsole({ projectId, canManage }) {
  const { tasks, isLoading, updateTask } = useTasks(projectId);
  const { members } = useMembers(projectId);
  const [selectedMember, setSelectedMember] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const [bouncingTaskId, setBouncingTaskId] = useState(null);

  const colorFor = useCallback(
    (userId) => {
      const idx = members.findIndex((m) => m.user?._id === userId);
      return AVATAR_PALETTE[idx >= 0 ? idx % AVATAR_PALETTE.length : 0];
    },
    [members],
  );

  const assign = useCallback(
    (taskId, memberId) => {
      updateTask.mutate({ taskId, payload: { assignedTo: memberId } });
      setBouncingTaskId(taskId);
      setSelectedMember(null);
      setTimeout(() => setBouncingTaskId(null), 240);
    },
    [updateTask],
  );

  return (
    <Panel label="Mod. Tasks — assign work, watch it complete" accent={T.teal}>
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2.5">
          <Users2 size={13} style={{ color: T.faint }} />
          <span className="font-mono text-[11px]" style={{ color: T.faint }}>
            {canManage
              ? "drag an avatar onto a task, or tap one then tap a task"
              : "you can toggle subtasks below; assignment is admin/project-admin only"}
          </span>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {members.map((m) => (
            <Avatar
              key={m.user?._id}
              member={m.user || {}}
              color={colorFor(m.user?._id)}
              draggable={canManage}
              dragging={draggingId === m.user?._id}
              dimmed={selectedMember && selectedMember !== m.user?._id}
              onDragStart={(e) => {
                if (!canManage) return;
                setDraggingId(m.user?._id);
                e.dataTransfer.setData("text/member-id", m.user?._id);
              }}
              onDragEnd={() => setDraggingId(null)}
              onClick={() =>
                canManage &&
                setSelectedMember((cur) =>
                  cur === m.user?._id ? null : m.user?._id,
                )
              }
              style={{
                outline:
                  selectedMember === m.user?._id
                    ? `2px solid ${colorFor(m.user?._id)}`
                    : "none",
                outlineOffset: 2,
                cursor: canManage ? "grab" : "default",
              }}
            />
          ))}
          {members.length === 0 && (
            <span className="font-mono text-[11px]" style={{ color: T.faint }}>
              No members on this project yet
            </span>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="py-6">
          <Loader2
            size={20}
            className="animate-spin mx-auto"
            style={{ color: T.faint }}
          />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {tasks.map((t) => (
            <TaskCard
              key={t._id}
              projectId={projectId}
              task={t}
              colorFor={colorFor}
              onAssign={assign}
              canManage={canManage}
              selectedMember={selectedMember}
              bouncing={bouncingTaskId === t._id}
            />
          ))}
          {tasks.length === 0 && (
            <p
              className="font-mono text-[11px] col-span-full"
              style={{ color: T.faint }}
            >
              No tasks in this project yet.
            </p>
          )}
        </div>
      )}
    </Panel>
  );
}


function NotesConsole({ projectId, role }) {
  const { notes, isLoading, createNote, updateNote } = useNotes(projectId);
  const isAdmin = role === ROLES.ADMIN;
  const note = notes[0];
  const [draft, setDraft] = useState(note?.content ?? "");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!dirty) setDraft(note?.content ?? "");
  }, [note?._id]);

  const handleChange = (e) => {
    setDraft(e.target.value);
    setDirty(true);
  };

  const handleSave = () => {
    if (!draft.trim()) return;
    if (note) {
      updateNote.mutate(
        { noteId: note._id, payload: { content: draft } },
        { onSuccess: () => setDirty(false) },
      );
    } else {
      createNote.mutate(
        { content: draft },
        { onSuccess: () => setDirty(false) },
      );
    }
  };

  const saving = createNote.isPending || updateNote.isPending;

  return (
    <Panel
      label="Mod. Notes — shared scratchpad for the team"
      accent={isAdmin ? T.amber : T.faint}
    >
      <div className="flex items-center justify-between mb-4">
        <span
          className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide"
          style={{ color: isAdmin ? T.amber : T.faint }}
        >
          {isAdmin ? <Pencil size={12} /> : <Lock size={12} />}
          {isAdmin ? "admin — editing live" : "read only"}
        </span>
        {isAdmin && dirty && (
          <button
            onClick={handleSave}
            disabled={saving || !draft.trim()}
            className="font-mono text-[11px] px-3 py-1.5 rounded-full transition-colors duration-200"
            style={{
              background: T.tealSoft,
              border: `1px solid #A7F3D0`,
              color: "#065F46",
            }}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        )}
      </div>

      {isLoading ? (
        <Loader2
          size={18}
          className="animate-spin"
          style={{ color: T.faint }}
        />
      ) : isAdmin ? (
        <textarea
          value={draft}
          onChange={handleChange}
          rows={6}
          placeholder="Write a shared note for the team…"
          className="w-full rounded-xl p-4 text-sm leading-relaxed outline-none resize-none transition-all duration-300"
          style={{
            background: "#FFFBEB",
            border: `1px solid ${T.amber}66`,
            color: T.text,
            animation: dirty ? "breathe 2.6s ease-in-out infinite" : "none",
            fontFamily: "ui-monospace, monospace",
          }}
        />
      ) : (
        <div
          className="relative w-full rounded-xl p-4 text-sm leading-relaxed whitespace-pre-wrap transition-all duration-300"
          style={{
            background: "#F8FAFC",
            border: `1px solid ${T.border}`,
            color: note ? T.dim : T.faint,
            minHeight: 152,
            animation: "fade-up 220ms ease-out both",
            fontFamily: "ui-monospace, monospace",
          }}
        >
          {note?.content || "No shared note yet — an admin hasn't written one."}
          <div
            className="absolute top-3 right-3 flex items-center gap-1 rounded-full px-2 py-1 font-mono text-[10px]"
            style={{
              background: "#FFFFFF",
              color: T.faint,
              border: `1px solid ${T.border}`,
            }}
          >
            <Lock size={10} /> locked
          </div>
        </div>
      )}
    </Panel>
  );
}


export default function ProjectWorkspace() {
  const { projectId } = useParams();
  const { project, isLoading } = useProject(projectId);

  if (isLoading) return <Loader full />;

  const canManage = [ROLES.ADMIN, ROLES.PROJECT_ADMIN].includes(project?.role);
  const canInvite = canManage;

  return (
    <div>
      <ProjectTabs project={project} projectId={projectId} />

      <div
        className="relative overflow-hidden rounded-2xl -mx-2 sm:mx-0 border border-slate-200"
        style={{
          background:
            "linear-gradient(to bottom right, #F1F5F9, #F8FAFC, #F1F5F9)",
        }}
      >
        <style>{KEYFRAMES}</style>

        {}
        <svg
          className="absolute -top-8 -right-8 w-72 h-56 text-slate-300/60 pointer-events-none hidden sm:block"
          viewBox="0 0 300 240"
          fill="none"
        >
          <path d="M30 240 L300 10" stroke="currentColor" strokeWidth="1.5" />
          <path d="M90 240 L300 60" stroke="currentColor" strokeWidth="1.5" />
          <path d="M150 240 L300 110" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <div className="absolute -bottom-10 -left-10 w-56 h-56 rounded-full bg-slate-300/20 blur-3xl pointer-events-none" />

        <header className="relative max-w-3xl mx-auto px-6 pt-8 pb-5">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: T.teal }}
            />
            <span
              className="font-mono text-[11px] uppercase tracking-widest"
              style={{ color: T.faint, letterSpacing: "0.2em" }}
            >
              Project Console
            </span>
          </div>
          <p className="text-sm" style={{ color: T.dim }}>
            Invite people, assign work, and keep a shared note in one place.
          </p>
        </header>

        <main className="relative max-w-3xl mx-auto px-6 pb-10 space-y-5">
          <InviteConsole projectId={projectId} canInvite={canInvite} />
          <TaskGridConsole projectId={projectId} canManage={canManage} />
          <NotesConsole projectId={projectId} role={project?.role} />
        </main>
      </div>
    </div>
  );
}
