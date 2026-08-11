import { Router } from "express";
import { auth } from "../../middleware/auth";
import { validate } from "../../middleware/validator";
import { createUserSchema, updateUserSchema, loginSchema } from "../../validators/user.validator";
import * as userController from "../../controllers/user.controller";

const router = Router();

router.post("/", validate(createUserSchema), userController.createUser);
router.put("/:id", auth(), validate(updateUserSchema), userController.updateUser);
router.get("/", auth(), userController.getAllUsers);
router.get("/:id", auth(), userController.getUser);
router.delete("/:id", auth(), userController.deleteUser);
router.post("/login", validate(loginSchema), userController.login);
router.get("/get/count", auth(), userController.getUserCount);

export default router;
