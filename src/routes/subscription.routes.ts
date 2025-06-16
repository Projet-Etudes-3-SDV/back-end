import { Router } from "express";
import { SubscriptionController } from "../controllers/subscription.controller";
import { checkJWT, checkRole } from "../middlewares/auth.middleware";
import { EncodedRequest } from "../utils/EncodedRequest";

const router = Router();
const subscriptionController = new SubscriptionController();

/**
 * @swagger
 * tags:
 *   name: Subscription
 *   description: Subscription management
 */

/**
 * @swagger
 * /api/subscriptions/cancel/:subscriptionId:
 *   post:
 *     summary: Cancel a subscription
 *     tags: [Subscription]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Subscription ID
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
 *         description: Subscription cancelled
 *       400:
 *         description: Invalid input
 */
router.post("/cancel/:subscriptionId", checkJWT, (req, res, next) => subscriptionController.cancelSubscription(req as EncodedRequest, res, next));

router.post("/admin/cancel/:subscriptionId", checkJWT, (req, res, next) => checkRole(req as EncodedRequest, res, next), (req, res, next) => subscriptionController.adminCancelSubscription(req as EncodedRequest, res, next));

/**
 * @swagger
 * /api/subscriptions:
 *   get:
 *     summary: Get subscriptions
 *     tags: [Subscription]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: false
 *         description: User ID
 *       - in: query
 *         name: planId
 *         schema:
 *           type: string
 *         required: false
 *         description: Plan ID
 *     responses:
 *       200:
 *         description: List of subscriptions
 *       400:
 *         description: Invalid input
 */
router.get("/", checkJWT, (req, res, next) => checkRole(req as EncodedRequest, res, next), (req, res, next) => subscriptionController.getSubscriptions(req, res, next));

/**
 * @swagger
 * /api/subscriptions:
 *   get:
 *     summary: Get subscriptions by ID
 *     tags: [Subscription]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: false
 *         description: User ID
 *       - in: query
 *         name: planId
 *         schema:
 *           type: string
 *         required: false
 *         description: Plan ID
 *     responses:
 *       200:
 *         description: List of subscriptions
 *       400:
 *         description: Invalid input
 */
router.get("/:id", checkJWT, (req, res, next) => checkRole(req as EncodedRequest, res, next), (req, res, next) => subscriptionController.getSubscriptionById(req, res, next));

/**
 * @swagger
 * /api/subscriptions:
 *   get:
 *     summary: Get subscriptions of a user
 *     tags: [Subscription]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: false
 *         description: User ID
 *       - in: query
 *         name: planId
 *         schema:
 *           type: string
 *         required: false
 *         description: Plan ID
 *     responses:
 *       200:
 *         description: List of subscriptions
 *       400:
 *         description: Invalid input
 */
router.get("/me", checkJWT, (req, res, next) => subscriptionController.getUserSubscriptions(req as EncodedRequest, res, next));

export default router;
