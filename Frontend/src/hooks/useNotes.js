import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { noteApi } from "../services/noteApi";
import { useToast } from "../context/ToastContext";

export function useNotes(projectId) {
  const queryClient = useQueryClient();
  const toast = useToast();

  const notesQuery = useQuery({
    queryKey: ["notes", projectId],
    queryFn: async () => {
      const { data } = await noteApi.getNotes(projectId);
      return data?.data ?? [];
    },
    enabled: !!projectId,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["notes", projectId] });

  const createNote = useMutation({
    mutationFn: (payload) => noteApi.createNote(projectId, payload),
    onSuccess: () => {
      toast.success("Note added");
      invalidate();
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to add note"),
  });

  const updateNote = useMutation({
    mutationFn: ({ noteId, payload }) => noteApi.updateNote(projectId, noteId, payload),
    onSuccess: () => {
      toast.success("Note updated");
      invalidate();
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to update note"),
  });

  const deleteNote = useMutation({
    mutationFn: (noteId) => noteApi.deleteNote(projectId, noteId),
    onSuccess: () => {
      toast.success("Note deleted");
      invalidate();
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to delete note"),
  });

  return {
    notes: notesQuery.data ?? [],
    isLoading: notesQuery.isLoading,
    createNote,
    updateNote,
    deleteNote,
  };
}
