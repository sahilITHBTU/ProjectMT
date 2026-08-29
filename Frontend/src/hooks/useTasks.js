import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi } from "../services/taskApi";
import { useToast } from "../context/ToastContext";

export function useTasks(projectId) {
  const queryClient = useQueryClient();
  const toast = useToast();

  const tasksQuery = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: async () => {
      const { data } = await taskApi.getTasks(projectId);
      return data?.data ?? [];
    },
    enabled: !!projectId,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });

  const createTask = useMutation({
    mutationFn: (payload) => taskApi.createTask(projectId, payload),
    onSuccess: () => {
      toast.success("Task created");
      invalidate();
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to create task"),
  });

  const updateTask = useMutation({
    mutationFn: ({ taskId, payload }) =>
      taskApi.updateTask(projectId, taskId, payload),
    onSuccess: () => {
      toast.success("Task updated");
      invalidate();
      queryClient.invalidateQueries({ queryKey: ["task", projectId] });
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to update task"),
  });

  const deleteTask = useMutation({
    mutationFn: (taskId) => taskApi.deleteTask(projectId, taskId),
    onSuccess: () => {
      toast.success("Task deleted");
      invalidate();
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to delete task"),
  });

  return {
    tasks: tasksQuery.data ?? [],
    isLoading: tasksQuery.isLoading,
    isError: tasksQuery.isError,
    refetch: tasksQuery.refetch,
    createTask,
    updateTask,
    deleteTask,
  };
}

export function useTask(projectId, taskId) {
  const queryClient = useQueryClient();
  const toast = useToast();

  const taskQuery = useQuery({
    queryKey: ["task", projectId, taskId],
    queryFn: async () => {
      const { data } = await taskApi.getTask(projectId, taskId);
      return data?.data ?? null;
    },
    enabled: !!projectId && !!taskId,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["task", projectId, taskId] });
    queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
  };

 

  const updateOwnStatus = useMutation({
    mutationFn: (status) => taskApi.updateTaskStatus(projectId, taskId, status),
    onSuccess: () => {
      toast.success("Status updated");
      invalidate();
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to update status"),
  });

  const updateOwnProgress = useMutation({
    mutationFn: (progress) =>
      taskApi.updateTaskProgress(projectId, taskId, progress),
    onSuccess: () => {
      toast.success("Progress updated");
      invalidate();
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to update progress"),
  });

  const addOwnAttachments = useMutation({
    mutationFn: (formData) =>
      taskApi.addTaskAttachments(projectId, taskId, formData),
    onSuccess: () => {
      toast.success("Attachment uploaded");
      invalidate();
    },
    onError: (err) =>
      toast.error(
        err?.response?.data?.message || "Failed to upload attachment",
      ),
  });

  return {
    task: taskQuery.data,
    isLoading: taskQuery.isLoading,
    isError: taskQuery.isError,
    refetch: taskQuery.refetch,
    updateOwnStatus,
    updateOwnProgress,
    addOwnAttachments,
  };
}
