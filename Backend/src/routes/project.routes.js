import { Router } from "express";
import { validate } from "../middlewares/validator.middlewares.js";
import {
  createProjectValidator,
  AddMemeberTOProject,
  inviteMemberValidator,
} from "../validators/index.js";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import {
  GetProjects,
  GetProjectById,
  CreateProject,
  UpdateProject,
  DeleteProject,
  AddMemberToProject,
  InviteMemberToProject,
  GetProjectMember,
  UpdateMemberRole,
  DeleteMember,
} from "../controllers/project.controllers.js";
import { ValidateProjectPermission } from "../middlewares/role.middleware.js";
import { AvailableUserRole, userRolesEnum } from "../utils/constants.js";
const router = Router();

router.use(verifyJwt);

router
  .route("/")
  .get(GetProjects)
  .post(createProjectValidator(), validate, CreateProject);

router
  .route("/:projectId")
  .get(ValidateProjectPermission(AvailableUserRole), GetProjectById)
  .put(
    ValidateProjectPermission([userRolesEnum.ADMIN]),
    createProjectValidator(),
    validate,
    UpdateProject,
  )
  .delete(ValidateProjectPermission([userRolesEnum.ADMIN]), DeleteProject);

router
  .route("/:projectId/members")
  .get(ValidateProjectPermission(AvailableUserRole), GetProjectMember)
  .post(
    ValidateProjectPermission([userRolesEnum.ADMIN]),
    AddMemeberTOProject(),
    validate,
    AddMemberToProject,
  );

router
  .route("/:projectId/members/invite")
  .post(
    ValidateProjectPermission([
      userRolesEnum.ADMIN,
      userRolesEnum.PROJECT_ADMIN,
    ]),
    inviteMemberValidator(),
    validate,
    InviteMemberToProject,
  );

router
  .route("/:projectId/members/:userId")
  .put(ValidateProjectPermission([userRolesEnum.ADMIN]), UpdateMemberRole)
  .delete(ValidateProjectPermission([userRolesEnum.ADMIN]), DeleteMember);

export default router;
