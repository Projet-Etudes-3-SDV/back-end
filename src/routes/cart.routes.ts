import { Router } from "express";
import { CartController } from "../controllers/cart.controller";
import { checkJWT } from "../middlewares/auth.middleware";
import { EncodedRequest } from "../utils/EncodedRequest";

const router = Router();
const cartController = new CartController();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Cart management
 */

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Add an item to the cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Item added to the cart
 *       400:
 *         description: Invalid input
 */
router.post("/add", (req, res, next) => cartController.addItemToCart(req, res, next));

/**
 * @swagger
 * /api/cart/update:
 *   put:
 *     summary: Update the cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cart updated
 *       400:
 *         description: Invalid input
 */
router.put("/update", (req, res, next) => cartController.updateCart(req, res, next));

/**
 * @swagger
 * /api/cart/delete:
 *   delete:
 *     summary: Delete an item from the cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Item deleted from the cart
 *       400:
 *         description: Invalid input
 */
router.delete("/delete", (req, res, next) => cartController.deleteItemFromCart(req, res, next));

/**
 * @swagger
 * /api/cart/reset:
 *   delete:
 *     summary: Reset the cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Cart reset
 *       400:
 *         description: Invalid input
 */
router.delete("/reset", (req, res, next) => cartController.resetCart(req, res, next));

/**
 * @swagger
 * /api/cart/me:
 *   get:
 *     summary: Get the cart of the user
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's cart
 *       401:
 *         description: Unauthorized
 */
router.get("/me", checkJWT, (req, res, next) => cartController.getCart(req as EncodedRequest, res, next));

/**
 * @swagger
 * /api/cart/validate:
 *   post:
 *     summary: Validate the cart and subscribe user to selected products
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cart validated and user subscribed
 *       400:
 *         description: Invalid input
 */
router.post("/validate", (req, res, next) => cartController.validateCart(req, res, next));

export default router;
