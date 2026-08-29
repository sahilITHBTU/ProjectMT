export const ROLES = {
  ADMIN: "admin",
  PROJECT_ADMIN: "project_admin",
  MEMBER: "member",
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: "Admin",
  [ROLES.PROJECT_ADMIN]: "Project Admin",
  [ROLES.MEMBER]: "Member",
};

export const AVAILABLE_ROLES = Object.values(ROLES);
