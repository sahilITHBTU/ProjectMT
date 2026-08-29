import api from "./api";

export const subTaskApi = {
  createSubTask: (projectId, taskId, payload) =>
    api.post(`/tasks/${projectId}/t/${taskId}/subtasks`, payload),
  updateSubTask: (projectId, subTaskId, payload) =>
    api.put(`/tasks/${projectId}/st/${subTaskId}`, payload),
  deleteSubTask: (projectId, subTaskId) =>
    api.delete(`/tasks/${projectId}/st/${subTaskId}`),
};
