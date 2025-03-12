import { Router } from "express";
import { SubscriptionController } from "../controllers/subscription.controller";

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
 * /api/subscription/activate:
 *   post:
 *     summary: Activate a subscription
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
 *       200:
 *         description: Subscription activated
 *       400:
 *         description: Invalid input
 */
router.post("/activate", (req, res) => subscriptionController.activateSubscription(req, res));

/**
 * @swagger
 * /api/subscription/cancel:
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
 *         description: Subscription canceled
 *       400:
 *         description: Invalid input
 */
router.post("/cancel", (req, res, next) => subscriptionController.cancelSubscription(req, res, next));

/**
 * @swagger
 * /api/subscription/update-end-date:
 *   post:
 *     summary: Update subscription end date
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
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Subscription end date updated
 *       400:
 *         description: Invalid input
 */
router.post("/update-end-date", (req, res, next) => subscriptionController.updateSubscriptionEndDate(req, res, next));

/**
 * @swagger
 * /api/subscription/is-active/{userId}:
 *   get:
 *     summary: Check if a subscription is active
 *     tags: [Subscription]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: Subscription status
 *       400:
 *         description: Invalid input
 */
router.get("/is-active/:userId", (req, res, next) => subscriptionController.isSubscriptionActive(req, res, next));

export default router;
