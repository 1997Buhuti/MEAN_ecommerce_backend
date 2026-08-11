import { Router } from "express";
import { validate } from "../../middleware/validator";
import { createProductSchema, updateProductSchema } from "../../validators/product.validator";
import { upload } from "../../middleware/upload";
import * as productController from "../../controllers/product.controller";

const router = Router();

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProduct);
router.post("/", upload.single("image"), validate(createProductSchema), productController.createProduct);
router.put("/:id", upload.single("image"), validate(updateProductSchema), productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
router.get("/get/count", productController.getProductCount);
router.get("/get/featured/:count", productController.getFeaturedProducts);
router.put("/gallery-images/:id", upload.array("images", 10), productController.updateGallery);

export default router;
