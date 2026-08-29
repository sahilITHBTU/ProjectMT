import { useState } from "react";
import { useParams } from "react-router-dom";
import { Plus, StickyNote, Trash2, Pencil } from "lucide-react";
import { useNotes } from "../../hooks/useNotes";
import { useProject } from "../../hooks/useProject";
import ProjectTabs from "../../components/layout/ProjectTabs";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Textarea from "../../components/ui/Textarea";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import PermissionGate from "../../components/auth/PermissionGate";
import { ROLES } from "../../constants/roles";
import { formatDateTime } from "../../utils/formatters";

export default function Notes() {
  const { projectId } = useParams();
  const { project } = useProject(projectId);
  const { notes, isLoading, createNote, updateNote, deleteNote } = useNotes(projectId);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [content, setContent] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const openCreate = () => {
    setEditing(null);
    setContent("");
    setModalOpen(true);
  };

  const openEdit = (note) => {
    setEditing(note);
    setContent(note.content);
    setModalOpen(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    if (editing) {
      await updateNote.mutateAsync({ noteId: editing._id, payload: { content } });
    } else {
      await createNote.mutateAsync({ content });
    }
    setModalOpen(false);
  };

  const onDelete = async () => {
    await deleteNote.mutateAsync(deleteTarget._id);
    setDeleteTarget(null);
  };

  return (
    <div>
      <ProjectTabs project={project} projectId={projectId} />

      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-slate-400">
          {notes.length} note{notes.length !== 1 && "s"}
        </p>
        <PermissionGate role={project?.role} allow={[ROLES.ADMIN]}>
          <Button icon={Plus} onClick={openCreate}>
            New Note
          </Button>
        </PermissionGate>
      </div>

      {isLoading ? (
        <Loader />
      ) : notes.length === 0 ? (
        <Card className="text-center py-16 flex flex-col items-center gap-3">
          <StickyNote size={26} className="text-slate-300" />
          <p className="text-sm text-slate-400">No notes yet.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <Card key={note._id} className="flex flex-col gap-3 group relative">
              <PermissionGate role={project?.role} allow={[ROLES.ADMIN]}>
                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(note)}
                    className="p-1.5 text-slate-300 hover:text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(note)}
                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </PermissionGate>
              <p className="text-sm text-slate-600 leading-relaxed pr-10 whitespace-pre-wrap">
                {note.content}
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-slate-50 mt-auto">
                <span className="text-[11px] font-semibold text-slate-400">
                  {note.createdBy?.username || note.createdBy?.fullName}
                </span>
                <span className="text-[11px] text-slate-300">
                  {formatDateTime(note.createdAt)}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Note" : "New Note"}>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Textarea
            rows={5}
            placeholder="Write a note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex justify-end gap-2.5">
            <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={createNote.isPending || updateNote.isPending}>
              Save
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={onDelete}
        title="Delete note"
        description="This note will be permanently deleted."
        confirmText="Delete"
      />
    </div>
  );
}
