import { Router } from "express";
import { CouponController } from "../controllers/coupon.controller";

const router = Router();
const couponController = new CouponController();

/**
 * @swagger
 * tags:
 *   name: Coupon
 *   description: Coupon management
 */

/**
 * @swagger
 * /api/coupons:
 *   get:
 *     summary: Get all coupons
 *     tags: [Coupon]
 *     responses:
 *       200:
 *         description: List of coupons
 *       400:
 *         description: Invalid input
 */
router.get("/", (req, res, next) => couponController.getCoupons(req, res, next));

/**
 * @swagger
 * /api/coupons:
 *   post:
 *     summary: Create a new coupon
 *     tags: [Coupon]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               discount:
 *                 type: number
 *               expirationDate:
 *                 type: string
 *                 format: date-time
 *               products:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Coupon created
 *       400:
 *         description: Invalid input
 */
router.post("/", (req, res, next) => couponController.createCoupon(req, res, next));

/**
 * @swagger
 * /api/coupons/{id}:
 *   put:
 *     summary: Update a coupon by ID
 *     tags: [Coupon]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Coupon ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               discount:
 *                 type: number
 *               expirationDate:
 *                 type: string
 *                 format: date-time
 *               products:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Coupon updated
 *       400:
 *         description: Invalid input
 */
router.put("/:id", (req, res, next) => couponController.updateCoupon(req, res, next));

/**
 * @swagger
 * /api/coupons/{id}:
 *   delete:
 *     summary: Delete a coupon by ID
 *     tags: [Coupon]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Coupon ID
 *     responses:
 *       204:
 *         description: Coupon deleted
 *       400:
 *         description: Invalid input
 */
router.delete("/:id", (req, res, next) => couponController.deleteCoupon(req, res, next));

export default router;
