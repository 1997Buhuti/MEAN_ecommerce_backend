import { Router } from "express";
import { validate } from "../../middleware/validator";
import { createOrderSchema, updateOrderSchema } from "../../validators/order.validator";
import * as orderController from "../../controllers/order.controller";

const router = Router();

router.get("/", orderController.getAllOrders);
router.get("/:id", orderController.getOrder);
router.post("/", validate(createOrderSchema), orderController.createOrder);
router.put("/:id", validate(updateOrderSchema), orderController.updateOrder);
router.delete("/:id", orderController.deleteOrder);
router.get("/get/totalsales", orderController.getTotalSales);
router.get("/get/count", orderController.getOrderCount);
router.get("/get/userorders/:userid", orderController.getUserOrders);

export default router;
