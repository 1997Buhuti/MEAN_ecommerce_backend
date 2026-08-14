import { Router } from "express";
import { validate } from "../../middleware/validator";
import { createOrderSchema, updateOrderSchema } from "../../validators/order.validator";
import * as orderController from "../../controllers/order.controller";

const router = Router();
// test commit
router.get("/count", orderController.getOrderCount);
router.get("/total-sales", orderController.getTotalSales);
router.get("/", orderController.getAllOrders);
router.get("/:id", orderController.getOrder);
router.post("/", validate(createOrderSchema), orderController.createOrder);
router.put("/:id", validate(updateOrderSchema), orderController.updateOrder);
router.delete("/:id", orderController.deleteOrder);

export default router;
