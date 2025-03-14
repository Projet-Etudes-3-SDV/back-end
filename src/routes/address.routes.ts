import { Router } from "express";
import { AddressController } from "../controllers/address.controller";

const router = Router();
const addressController = new AddressController();

/**
 * @swagger
 * tags:
 *   name: Address
 *   description: Address management
 */

/**
 * @swagger
 * /api/addresses:
 *   post:
 *     summary: Create a new address
 *     tags: [Address]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               country:
 *                 type: string
 *     responses:
 *       200:
 *         description: Address created
 *       400:
 *         description: Invalid input
 */
router.post("/", (req, res, next) => addressController.createAddress(req, res, next));

/**
 * @swagger
 * /api/addresses/{id}:
 *   get:
 *     summary: Get an address by ID
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address details
 *       400:
 *         description: Invalid input
 */
router.get("/:id", (req, res, next) => addressController.getAddress(req, res, next));

/**
 * @swagger
 * /api/addresses/{id}:
 *   put:
 *     summary: Update an address by ID
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Address ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               country:
 *                 type: string
 *     responses:
 *       200:
 *         description: Address updated
 *       400:
 *         description: Invalid input
 */
router.put("/:id", (req, res, next) => addressController.updateAddress(req, res, next));

/**
 * @swagger
 * /api/addresses/{id}:
 *   delete:
 *     summary: Delete an address by ID
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address deleted
 *       400:
 *         description: Invalid input
 */
router.delete("/:id", (req, res, next) => addressController.deleteAddress(req, res, next));

export default router;
