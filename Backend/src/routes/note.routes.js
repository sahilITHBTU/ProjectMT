import { Router } from "express";
import { validate } from "../middlewares/validator.middlewares.js";
import { createNoteValidator, updateNoteValidator } from "../validators/index.js";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import { ValidateProjectPermission } from "../middlewares/role.middleware.js";
import { AvailableUserRole, userRolesEnum } from "../utils/constants.js";
import {
  getNotes,
  createNote,
  getNoteById,
  updateNote,
  deleteNote,
} from "../controllers/notes.controllers.js";

const router = Router({ mergeParams: true });

router.use(verifyJwt);

router
  .route("/:projectId")
  .get(ValidateProjectPermission(AvailableUserRole), getNotes)
  .post(
    ValidateProjectPermission([userRolesEnum.ADMIN]),
    createNoteValidator(),
    validate,
    createNote,
  );

router
  .route("/:projectId/n/:noteId")
  .get(ValidateProjectPermission(AvailableUserRole), getNoteById)
  .put(
    ValidateProjectPermission([userRolesEnum.ADMIN]),
    updateNoteValidator(),
    validate,
    updateNote,
  )
  .delete(ValidateProjectPermission([userRolesEnum.ADMIN]), deleteNote);

export default router;
