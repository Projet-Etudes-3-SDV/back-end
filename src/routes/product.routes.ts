import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { EncodedRequest } from "../utils/EncodedRequest";
import { checkJWT, checkRole } from "../middlewares/auth.middleware";

const router = Router();
const productController = new ProductController();

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product management
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product created
 *       400:
 *         description: Invalid input
 */
router.post("/", checkJWT, (req, res, next) => checkRole(req as EncodedRequest, res, next), (req, res, next) => productController.createProduct(req, res, next));

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *       400:
 *         description: Invalid input
 */
router.get("/:id", (req, res, next) => productController.getProduct(req, res, next));

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: List of products
 *       400:
 *         description: Invalid input
 */
router.get("/", (req, res, next) => productController.getProducts(req, res, next));

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product updated
 *       400:
 *         description: Invalid input
 */
router.put("/:id", checkJWT, (req, res, next) => checkRole(req as EncodedRequest, res, next), (req, res, next) => productController.updateProduct(req as EncodedRequest, res, next));

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted
 *       400:
 *         description: Invalid input
 */
router.delete("/:id", checkJWT, (req, res, next) => checkRole(req as EncodedRequest, res, next), (req, res, next) => productController.deleteProduct(req as EncodedRequest, res, next));

export default router;