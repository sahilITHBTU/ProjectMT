import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectApi } from "../services/projectApi";
import { useToast } from "../context/ToastContext";

export function useMembers(projectId) {
  const queryClient = useQueryClient();
  const toast = useToast();

  const membersQuery = useQuery({
    queryKey: ["members", projectId],
    queryFn: async () => {
      const { data } = await projectApi.getMembers(projectId);
      return data?.data ?? [];
    },
    enabled: !!projectId,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["members", projectId] });

  const addMember = useMutation({
    mutationFn: (payload) => projectApi.addMember(projectId, payload),
    onSuccess: () => {
      toast.success("Member added");
      invalidate();
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to add member"),
  });

  const inviteMember = useMutation({
    mutationFn: (payload) => projectApi.inviteMember(projectId, payload),
    onSuccess: (res) => {
      const status = res?.data?.data?.status;
      toast.success(status === "joined" ? "User added to the project" : "Invitation sent");
      invalidate();
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to send invite"),
  });

  const updateRole = useMutation({
    mutationFn: ({ userId, newRole }) =>
      projectApi.updateMemberRole(projectId, userId, { newRole }),
    onSuccess: () => {
      toast.success("Role updated");
      invalidate();
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to update role"),
  });

  const removeMember = useMutation({
    mutationFn: (userId) => projectApi.removeMember(projectId, userId),
    onSuccess: () => {
      toast.success("Member removed");
      invalidate();
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to remove member"),
  });

  return {
    members: membersQuery.data ?? [],
    isLoading: membersQuery.isLoading,
    addMember,
    inviteMember,
    updateRole,
    removeMember,
  };
}
