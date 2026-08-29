import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subTaskApi } from "../services/subTaskApi";
import { useToast } from "../context/ToastContext";

export function useSubTasks(projectId, taskId) {
  const queryClient = useQueryClient();
  const toast = useToast();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["task", projectId, taskId] });
    queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
  };

  const createSubTask = useMutation({
    mutationFn: (payload) => subTaskApi.createSubTask(projectId, taskId, payload),
    onSuccess: () => {
      toast.success("Subtask added");
      invalidate();
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to add subtask"),
  });

  const updateSubTask = useMutation({
    mutationFn: ({ subTaskId, payload }) =>
      subTaskApi.updateSubTask(projectId, subTaskId, payload),
    onSuccess: () => invalidate(),
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to update subtask"),
  });

  const deleteSubTask = useMutation({
    mutationFn: (subTaskId) => subTaskApi.deleteSubTask(projectId, subTaskId),
    onSuccess: () => {
      toast.success("Subtask removed");
      invalidate();
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to remove subtask"),
  });

  return { createSubTask, updateSubTask, deleteSubTask };
}
