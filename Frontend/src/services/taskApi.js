import api from "./api";

export const taskApi = {
  getTasks: (projectId) => api.get(`/tasks/${projectId}`),
  getTask: (projectId, taskId) => api.get(`/tasks/${projectId}/t/${taskId}`),
  createTask: (projectId, payload) => {
    const isFormData = payload instanceof FormData;
    return api.post(`/tasks/${projectId}`, payload, {
      headers: isFormData
        ? { "Content-Type": "multipart/form-data" }
        : undefined,
    });
  },
  updateTask: (projectId, taskId, payload) => {
    const isFormData = payload instanceof FormData;
    return api.put(`/tasks/${projectId}/t/${taskId}`, payload, {
      headers: isFormData
        ? { "Content-Type": "multipart/form-data" }
        : undefined,
    });
  },
  deleteTask: (projectId, taskId) =>
    api.delete(`/tasks/${projectId}/t/${taskId}`),

 
  updateTaskStatus: (projectId, taskId, status) =>
    api.patch(`/tasks/${projectId}/t/${taskId}/status`, { status }),
  updateTaskProgress: (projectId, taskId, progress) =>
    api.patch(`/tasks/${projectId}/t/${taskId}/progress`, { progress }),
  addTaskAttachments: (projectId, taskId, formData) =>
    api.post(`/tasks/${projectId}/t/${taskId}/attachments`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getTaskComments: (projectId, taskId) =>
    api.get(`/tasks/${projectId}/t/${taskId}/comments`),
  createTaskComment: (projectId, taskId, content) =>
    api.post(`/tasks/${projectId}/t/${taskId}/comments`, { content }),
};
