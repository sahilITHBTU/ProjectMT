import api from "./api";

export const healthCheckApi = {
  check: () => api.get("/healthcheck"),
};
