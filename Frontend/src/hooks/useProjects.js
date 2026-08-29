import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectApi } from "../services/projectApi";
import { useToast } from "../context/ToastContext";

export function useProjects() {
  const queryClient = useQueryClient();
  const toast = useToast();

  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await projectApi.getProjects();
      return data?.data ?? [];
    },
  });

  const createProject = useMutation({
    mutationFn: (payload) => projectApi.createProject(payload),
    onSuccess: () => {
      toast.success("Project created");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to create project"),
  });

  const deleteProject = useMutation({
    mutationFn: (projectId) => projectApi.deleteProject(projectId),
    onSuccess: () => {
      toast.success("Project deleted");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to delete project"),
  });

  return {
    projects: projectsQuery.data ?? [],
    isLoading: projectsQuery.isLoading,
    isError: projectsQuery.isError,
    refetch: projectsQuery.refetch,
    createProject,
    deleteProject,
  };
}
