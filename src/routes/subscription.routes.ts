import { Router } from "express";
import { SubscriptionController } from "../controllers/subscription.controller";
import * as Auth from "../middlewares/auth.middleware";

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
 * /api/subscriptions:
 *   post:
 *     summary: Create a new subscription
 *     tags: [Subscription]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               planId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Subscription created
 *       400:
 *         description: Invalid input
 */
router.post("/", (req, res, next) => subscriptionController.addSubscription(req, res, next));

/**
 * @swagger
 * /api/subscriptions/{id}:
 *   patch:
 *     summary: Update a subscription by ID
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
 *               planId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Subscription updated
 *       400:
 *         description: Invalid input
 */
router.patch("/:id", (req, res, next) => subscriptionController.patchSubscription(req, res, next));

/**
 * @swagger
 * /api/subscriptions/cancel:
 *   post:
 *     summary: Cancel a subscription
 *     tags: [Subscription]
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
router.post("/cancel", (req, res, next) => subscriptionController.cancelSubscription(req, res, next));

/**
 * @swagger
 * /api/subscriptions/{id}:
 *   delete:
 *     summary: Delete a subscription by ID
 *     tags: [Subscription]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Subscription ID
 *     responses:
 *       200:
 *         description: Subscription deleted
 *       400:
 *         description: Invalid input
 */
router.delete("/:id", (req, res, next) => subscriptionController.deleteSubscription(req, res, next));

/**
 * @swagger
 * /api/subscriptions:
 *   get:
 *     summary: Get subscriptions with filters
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
router.get("/", (req, res, next) => subscriptionController.getSubscriptionBy(req, res, next));

export default router;
