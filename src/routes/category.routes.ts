import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { EncodedRequest } from "../utils/EncodedRequest";

const router = Router();
const categoryController = new CategoryController();

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Category management
 */

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new categories
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category created
 *       400:
 *         description: Invalid input
 */
router.post("/", categoryController.createCategory.bind(categoryController));

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get a categories by ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category details
 *       400:
 *         description: Invalid input
 */
router.get("/:id", categoryController.getCategory.bind(categoryController));

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: List of categories
 *       400:
 *         description: Invalid input
 */
router.get("/", categoryController.getCategories.bind(categoryController));

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update a categories by ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated
 *       400:
 *         description: Invalid input
 */
router.put("/:id", (req, res, next) => categoryController.updateCategory(req as unknown as EncodedRequest, res, next));

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a categories by ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted
 *       400:
 *         description: Invalid input
 */
router.delete("/:id", categoryController.deleteCategory.bind(categoryController));

export default router;
