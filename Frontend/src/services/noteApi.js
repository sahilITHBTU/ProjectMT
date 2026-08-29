import api from "./api";

export const noteApi = {
  getNotes: (projectId) => api.get(`/notes/${projectId}`),
  getNote: (projectId, noteId) => api.get(`/notes/${projectId}/n/${noteId}`),
  createNote: (projectId, payload) => api.post(`/notes/${projectId}`, payload),
  updateNote: (projectId, noteId, payload) =>
    api.put(`/notes/${projectId}/n/${noteId}`, payload),
  deleteNote: (projectId, noteId) => api.delete(`/notes/${projectId}/n/${noteId}`),
};
