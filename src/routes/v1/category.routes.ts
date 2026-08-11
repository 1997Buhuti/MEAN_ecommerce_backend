import { Router } from "express";
import { validate } from "../../middleware/validator";
import { createCategorySchema, updateCategorySchema } from "../../validators/category.validator";
import * as categoryController from "../../controllers/category.controller";

const router = Router();

router.get("/", categoryController.getAllCategories);
router.put("/:id", validate(updateCategorySchema), categoryController.updateCategory);
router.get("/:id", categoryController.getCategory);
router.post("/", validate(createCategorySchema), categoryController.createCategory);
router.delete("/:id", categoryController.deleteCategory);

export default router;
