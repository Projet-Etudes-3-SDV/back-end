import { Router } from "express";
import { SubscriptionController } from "../controllers/subscription.controller";

const router = Router();
const subscriptionController = new SubscriptionController();

router.post("/activate", (req, res) => subscriptionController.activateSubscription(req, res));
router.post("/cancel", (req, res) => subscriptionController.cancelSubscription(req, res));
router.post("/update-end-date", (req, res) => subscriptionController.updateSubscriptionEndDate(req, res));
router.get("/is-active/:userId", (req, res) => subscriptionController.isSubscriptionActive(req, res));

export default router;
