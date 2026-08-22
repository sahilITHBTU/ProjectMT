const userRolesEnum = {
  ADMIN: "admin",
  PROJECT_ADMIN: "project_admin",
  MEMBER: "member",
};

const AvailableUserRole = Object.values(userRolesEnum);
const TaskStatusEnum = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  DONE: "done",
};
const AvailableTaskStatus = Object.values(TaskStatusEnum);

export {
  userRolesEnum,
  AvailableUserRole,
  AvailableTaskStatus,
  TaskStatusEnum,
};
