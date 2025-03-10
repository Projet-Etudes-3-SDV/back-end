import { Router } from "express";
import { CartController } from "../controllers/cart.controller";

const router = Router();
const cartController = new CartController();

router.post("/add", (req, res, next) => cartController.addItemToCart(req, res, next));
router.post("/delete", (req, res, next) => cartController.deleteItemFromCart(req, res, next));
router.post("/reset", (req, res, next) => cartController.resetCart(req, res, next));

export default router;
