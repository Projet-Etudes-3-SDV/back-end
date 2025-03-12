import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { EncodedRequest } from "../utils/EncodedRequest";

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
 * /product:
 *   post:
 *     summary: Create a new product
 *     tags: [Product]
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
router.post("/", (req, res, next) => productController.createProduct(req, res, next));

/**
 * @swagger
 * /products/{id}:
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
router.get("/:id", (req, res, next) => productController.getProduct(req as unknown as EncodedRequest, res, next));

/**
 * @swagger
 * /product:
 *   get:
 *     summary: Get all products
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: List of products
 *       400:
 *         description: Invalid input
 */
router.get("/", (req, res, next) => productController.getProducts(req as EncodedRequest, res, next));

/**
 * @swagger
 * /products/{id}:
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
router.put("/:id", (req, res, next) => productController.updateProduct(req as unknown as EncodedRequest, res, next));

/**
 * @swagger
 * /products/{id}:
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
router.delete("/:id", (req, res, next) => productController.deleteProduct(req as unknown as EncodedRequest, res, next));

export default router;