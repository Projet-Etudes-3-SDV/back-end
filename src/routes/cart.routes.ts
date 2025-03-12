import { Router } from "express";
import { CartController } from "../controllers/cart.controller";

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
 * /cart/add:
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
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Item added to the cart
 *       400:
 *         description: Invalid input
 */
router.post("/add", (req, res, next) => cartController.addItemToCart(req, res, next));

/**
 * @swagger
 * /cart/update:
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
 *               productId:
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
 * /cart/delete:
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
 * /cart/reset:
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

export default router;
