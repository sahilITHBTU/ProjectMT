import api from "./api";

export const projectApi = {
  getProjects: () => api.get("/projects"),
  getProject: (projectId) => api.get(`/projects/${projectId}`),
  createProject: (payload) => api.post("/projects", payload),
  updateProject: (projectId, payload) => api.put(`/projects/${projectId}`, payload),
  deleteProject: (projectId) => api.delete(`/projects/${projectId}`),

  getMembers: (projectId) => api.get(`/projects/${projectId}/members`),
  addMember: (projectId, payload) => api.post(`/projects/${projectId}/members`, payload),
  inviteMember: (projectId, payload) =>
    api.post(`/projects/${projectId}/members/invite`, payload),
  updateMemberRole: (projectId, userId, payload) =>
    api.put(`/projects/${projectId}/members/${userId}`, payload),
  removeMember: (projectId, userId) =>
    api.delete(`/projects/${projectId}/members/${userId}`),
};
