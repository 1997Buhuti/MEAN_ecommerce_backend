import { Router } from "express";
import { auth } from "../../middleware/auth";
import { validate } from "../../middleware/validator";
import { createUserSchema, updateUserSchema, loginSchema } from "../../validators/user.validator";
import * as userController from "../../controllers/user.controller";
import * as orderController from "../../controllers/order.controller";

const router = Router();

router.post("/login", validate(loginSchema), userController.login);
router.get("/count", auth(), userController.getUserCount);
router.get("/:userId/orders", auth(), orderController.getUserOrders);
router.post("/", validate(createUserSchema), userController.createUser);
router.get("/", auth(), userController.getAllUsers);
router.get("/:id", auth(), userController.getUser);
router.put("/:id", auth(), validate(updateUserSchema), userController.updateUser);
router.delete("/:id", auth(), userController.deleteUser);

export default router;
