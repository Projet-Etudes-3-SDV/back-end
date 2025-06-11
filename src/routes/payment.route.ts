import { stripeWebhook, createCheckoutSession } from '../controllers/payment.controller';
import express, { Router } from 'express';
import { EncodedRequest } from '../utils/EncodedRequest';
import { checkJWT } from '../middlewares/auth.middleware';
const router = Router();

router.post('/webhook', express.raw({ type: 'application/json' }),(req, res, next) => stripeWebhook(req, res, next));
router.post('/checkout', express.json(), checkJWT, (req, res, next) => createCheckoutSession(req as EncodedRequest, res, next));

export default router;