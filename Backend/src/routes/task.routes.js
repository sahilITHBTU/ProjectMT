import { Router } from "express";
import { validate } from "../middlewares/validator.middlewares.js";
import {
  createTaskValidator,
  updateTaskValidator,
  createSubTaskValidator,
  updateSubTaskValidator,
  updateTaskStatusValidator,
  updateTaskProgressValidator,
  createTaskCommentValidator,
} from "../validators/index.js";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  ValidateProjectPermission,
  ValidateTaskAssignee,
} from "../middlewares/role.middleware.js";
import { AvailableUserRole, userRolesEnum } from "../utils/constants.js";
import {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskProgress,
  addTaskAttachments,
} from "../controllers/task.controllers.js";
import {
  createSubTask,
  updateSubTask,
  deleteSubTask,
} from "../controllers/subtask.controllers.js";
import {
  getTaskComments,
  createTaskComment,
} from "../controllers/taskComment.controllers.js";

const router = Router({ mergeParams: true });

router.use(verifyJwt);

router
  .route("/:projectId")
  .get(ValidateProjectPermission(AvailableUserRole), getTasks)
  .post(
    ValidateProjectPermission([
      userRolesEnum.ADMIN,
      userRolesEnum.PROJECT_ADMIN,
    ]),
    upload.array("attachemants", 5),
    createTaskValidator(),
    validate,
    createTask,
  );

router
  .route("/:projectId/t/:taskId")
  .get(ValidateProjectPermission(AvailableUserRole), getTaskById)
  .put(
    ValidateProjectPermission([
      userRolesEnum.ADMIN,
      userRolesEnum.PROJECT_ADMIN,
    ]),
    upload.array("attachemants", 5),
    updateTaskValidator(),
    validate,
    updateTask,
  )
  .delete(
    ValidateProjectPermission([
      userRolesEnum.ADMIN,
      userRolesEnum.PROJECT_ADMIN,
    ]),
    deleteTask,
  );


router
  .route("/:projectId/t/:taskId/status")
  .patch(
    ValidateProjectPermission(AvailableUserRole),
    ValidateTaskAssignee,
    updateTaskStatusValidator(),
    validate,
    updateTaskStatus,
  );

router
  .route("/:projectId/t/:taskId/progress")
  .patch(
    ValidateProjectPermission(AvailableUserRole),
    ValidateTaskAssignee,
    updateTaskProgressValidator(),
    validate,
    updateTaskProgress,
  );

router
  .route("/:projectId/t/:taskId/attachments")
  .post(
    ValidateProjectPermission(AvailableUserRole),
    ValidateTaskAssignee,
    upload.array("attachemants", 5),
    addTaskAttachments,
  );

router
  .route("/:projectId/t/:taskId/comments")
  .get(ValidateProjectPermission(AvailableUserRole), getTaskComments)
  .post(
    ValidateProjectPermission(AvailableUserRole),
    ValidateTaskAssignee,
    createTaskCommentValidator(),
    validate,
    createTaskComment,
  );

router
  .route("/:projectId/t/:taskId/subtasks")
  .post(
    ValidateProjectPermission([
      userRolesEnum.ADMIN,
      userRolesEnum.PROJECT_ADMIN,
    ]),
    createSubTaskValidator(),
    validate,
    createSubTask,
  );

router
  .route("/:projectId/st/:subTaskId")
  .put(
    ValidateProjectPermission(AvailableUserRole),
    updateSubTaskValidator(),
    validate,
    updateSubTask,
  )
  .delete(
    ValidateProjectPermission([
      userRolesEnum.ADMIN,
      userRolesEnum.PROJECT_ADMIN,
    ]),
    deleteSubTask,
  );

export default router;
