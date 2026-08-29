import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi } from "../services/taskApi";
import { useToast } from "../context/ToastContext";

export function useTaskComments(projectId, taskId) {
  const queryClient = useQueryClient();
  const toast = useToast();

  const commentsQuery = useQuery({
    queryKey: ["taskComments", projectId, taskId],
    queryFn: async () => {
      const { data } = await taskApi.getTaskComments(projectId, taskId);
      return data?.data ?? [];
    },
    enabled: !!projectId && !!taskId,
  });

  const addComment = useMutation({
    mutationFn: (content) => taskApi.createTaskComment(projectId, taskId, content),
    onSuccess: () => {
      toast.success("Note added");
      queryClient.invalidateQueries({ queryKey: ["taskComments", projectId, taskId] });
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to add note"),
  });

  return {
    comments: commentsQuery.data ?? [],
    isLoading: commentsQuery.isLoading,
    addComment,
  };
}
