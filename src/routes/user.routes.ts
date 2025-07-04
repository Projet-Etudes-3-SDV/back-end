import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { EncodedRequest } from "../utils/EncodedRequest";
import { checkJWT, checkRole } from "../middlewares/auth.middleware";

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
 * /api/users/register:
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
router.post("/register", (req, res, next) => userController.createUser(req, res, next));

/**
 * @swagger
 * /api/users/login:
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
 *         description: Pleas validate your login with the code sent to your email
 *       400:
 *         description: Invalid input
 */
router.post("/login", (req, res, next) => userController.login(req, res, next));

/**
 * @swagger
 * /api/users/validate-login:
 *   post:
 *     summary: Validate User login
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
 *               authCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in
 *       400:
 *         description: Invalid input
 */
router.post("/validate-login", (req, res, next) => userController.validateLogin(req, res, next));

/**
 * @swagger
 * /api/users/refresh:
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
router.post("/refresh", checkJWT, (req, res, next) => userController.refresh(req, res, next));

/**
 * @swagger
 * /api/users/forgot-password:
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
 * /api/users/validate:
 *   post:
 *     summary: Validate user account
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               authToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: User validated
 *       400:
 *         description: Invalid input
 */
router.post("/validate", (req, res, next) => userController.validateUserMail(req, res, next));

/**
 * @swagger
 * /api/users/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset
 *       400:
 *         description: Invalid input
 */
router.post("/reset-password", (req, res, next) => userController.resetPassword(req, res, next));

/**
 * @swagger
 * /api/users/add-address:
 *   post:
 *     summary: Add an address to the user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Address added
 *       400:
 *         description: Invalid input
 */
router.post("/add-address", checkJWT, (req, res, next) => userController.addAddress(req as EncodedRequest, res, next));


/**
 * @swagger
 * /api/users/update-address:
 *   put:
 *     summary: Update an address of the user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               addressId:
 *                 type: string
 *               newAddress:
 *                 type: string
 *     responses:
 *       200:
 *         description: Address updated
 *       400:
 *         description: Invalid input
 */
router.put("/update-address/:index", checkJWT, (req, res, next) => userController.updateAddress(req as EncodedRequest, res, next));

/**
 * @swagger
 * /api/users/remove-address:
 *   post:
 *     summary: Remove an address from the user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               addressId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Address removed
 *       400:
 *         description: Invalid input
 */
router.delete("/remove-address/:index", checkJWT, (req, res, next) => userController.deleteAddress(req as EncodedRequest, res, next));

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: List of users
 *       400:
 *         description: Invalid input
 */
router.get("/", checkJWT, (req, res, next) => checkRole(req as EncodedRequest, res, next), (req, res, next) => userController.getUsers(req as EncodedRequest, res, next));

/**
 * @swagger
 * /api/users/{id}:
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
router.put("/:id", checkJWT, (req, res, next) => checkRole(req as EncodedRequest, res, next), (req, res, next) => userController.updateUser(req, res, next));

/**
 * @swagger
 * /api/users/{id}:
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
router.delete("/", checkJWT, (req, res, next) => checkRole(req as EncodedRequest, res, next), (req, res, next) => userController.deleteUsers(req, res, next));



/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete users by ID
 *     description: Deletes many users by ID. Requires admin role.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: User deleted
 *       400:
 *         description: Invalid input
 */
router.delete("/:id", checkJWT, (req, res, next) => checkRole(req as EncodedRequest, res, next), (req, res, next) => userController.deleteUser(req, res, next));

/**
 * @swagger
 * /api/users/{id}:
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
router.patch("/admin/:id", checkJWT, (req, res, next) => checkRole(req as EncodedRequest, res, next), (req, res, next) => userController.patchUser(req, res, next));

/**
 * @swagger
 * /api/users/{id}:
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
router.patch("/", checkJWT, (req, res, next) => userController.patchAccount(req as EncodedRequest, res, next));

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get the current user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details
 *       400:
 *         description: Invalid input
 */
router.get("/me", checkJWT, (req, res, next) => userController.getMe(req as unknown as EncodedRequest, res, next));

export default router;