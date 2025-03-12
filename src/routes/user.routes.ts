import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { EncodedRequest } from "../utils/EncodedRequest";
import * as Auth from "../middlewares/auth.middleware"

const router = Router();
const userController = new UserController();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management
 */

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User created
 *       400:
 *         description: Invalid input
 */
router.post("/", (req, res, next) => userController.createUser(req, res, next));

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: User login
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in
 *       400:
 *         description: Invalid input
 */
router.post("/login", (req, res, next) => userController.login(req as EncodedRequest, res, next));

/**
 * @swagger
 * /user/refresh:
 *   post:
 *     summary: Refresh user token
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed
 *       400:
 *         description: Invalid input
 */
router.post("/refresh", (req, res, next) => userController.refresh(req, res, next));

/**
 * @swagger
 * /user/forgot-password:
 *   post:
 *     summary: Forgot password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset link sent
 *       400:
 *         description: Invalid input
 */
router.post("/forgot-password", (req, res, next) => userController.forgotPassword(req, res, next));

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *       400:
 *         description: Invalid input
 */
router.get("/:id", Auth.checkJWT, (req, res, next) => userController.getUser(req as unknown as EncodedRequest, res, next));

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: List of users
 *       400:
 *         description: Invalid input
 */
router.get("/", (req, res, next) => userController.getUsers(req as EncodedRequest, res, next));

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 *       400:
 *         description: Invalid input
 */
router.put("/:id", (req, res, next) => userController.updateUser(req, res, next));

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted
 *       400:
 *         description: Invalid input
 */
router.delete("/:id", (req, res, next) => userController.deleteUser(req, res, next));

/**
 * @swagger
 * /user/{id}:
 *   patch:
 *     summary: Patch a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User patched
 *       400:
 *         description: Invalid input
 */
router.patch("/:id", (req, res, next) => userController.patchUser(req, res, next));

export default router;