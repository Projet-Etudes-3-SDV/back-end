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
router.post("/add", checkJWT, (req, res, next) => cartController.addItemToCart(req, res, next));

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
router.put("/update", checkJWT, (req, res, next) => cartController.updateCart(req, res, next));

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
router.delete("/delete", checkJWT, (req, res, next) => cartController.deleteItemFromCart(req, res, next));

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
router.delete("/reset", checkJWT, (req, res, next) => cartController.resetCart(req, res, next));

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
 *     summary: Buys the items in the cart
 *     description: This endpoint simulates the purchase of the items in the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Buy successful
 *       401:
 *         description: Unauthorized
 */
router.post("/validate", checkJWT, (req, res, next) => cartController.validateCart(req as EncodedRequest, res, next));

export default router;
