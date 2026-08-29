import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectApi } from "../services/projectApi";
import { useToast } from "../context/ToastContext";

export function useProject(projectId) {
  const queryClient = useQueryClient();
  const toast = useToast();

  const projectQuery = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const { data } = await projectApi.getProject(projectId);
      return data?.data ?? null;
    },
    enabled: !!projectId,
  });

  const updateProject = useMutation({
    mutationFn: (payload) => projectApi.updateProject(projectId, payload),
    onSuccess: () => {
      toast.success("Project updated");
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to update project"),
  });

  return {
    project: projectQuery.data,
    isLoading: projectQuery.isLoading,
    isError: projectQuery.isError,
    refetch: projectQuery.refetch,
    updateProject,
  };
}
