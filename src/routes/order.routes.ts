import { Router } from "express";
import { OrderController } from "../controllers/order.controller";

const router = Router();
const orderController = new OrderController();

router.post("/", (req, res, next) => orderController.createOrder(req, res, next));
router.get("/:id", (req, res, next) => orderController.getOrder(req, res, next));
router.get("/", (req, res, next) => orderController.getOrders(req, res, next));
router.put("/:id", (req, res, next) => orderController.updateOrder(req, res, next));
router.delete("/:id", (req, res, next) => orderController.deleteOrder(req, res, next));

export default router;
