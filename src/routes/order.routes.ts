import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { checkJWT, checkRole } from "../middlewares/auth.middleware";
import { EncodedRequest } from "../utils/EncodedRequest";

const router = Router();
const orderController = new OrderController();

router.post("/", checkJWT, (req, res, next) => orderController.createOrder(req, res, next));
router.get("/:id", checkJWT, (req, res, next) => orderController.getOrder(req, res, next));
router.get("/", checkJWT, (req, res, next) => checkRole(req as EncodedRequest, res, next), (req, res, next) => orderController.getOrders(req, res, next));
router.get("/user/", checkJWT, (req, res, next) => orderController.getOrdersByUser(req as EncodedRequest, res, next));

router.put("/:id", checkJWT, (req, res, next) => checkRole(req as EncodedRequest, res, next), (req, res, next) => orderController.updateOrder(req, res, next));
router.delete("/:id", checkJWT, (req, res, next) => checkRole(req as EncodedRequest, res, next), (req, res, next) => orderController.deleteOrder(req, res, next));

export default router;
