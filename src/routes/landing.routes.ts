import { Router } from "express";
import { LandingController } from "../controllers/landing.controller";
import { checkJWT, checkRole } from "../middlewares/auth.middleware";
import { EncodedRequest } from "../utils/EncodedRequest";

const router = Router();
const landingController = new LandingController();

/**
 * @swagger
 * tags:
 *   name: Landing
 *   description: Landing management
 */

/**
 * @swagger
 * /api/landings:
 *   post:
 *     summary: Create a new landing
 *     tags: [Landing]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Landing created
 *       400:
 *         description: Validation failed
 */
router.post("/", checkJWT, (req, res, next) => checkRole(req as EncodedRequest, res, next), (req, res, next) => landingController.createLanding(req, res, next));

/**
 * @swagger
 * /api/landings/{id}:
 *   get:
 *     summary: Get a landing by ID
 *     tags: [Landing]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Landing ID
 *     responses:
 *       200:
 *         description: Landing details
 *       404:
 *         description: Landing not found
 */
router.get("/:id", (req, res, next) => landingController.getLandingById(req, res, next));

/**
 * @swagger
 * /api/landings:
 *   get:
 *     summary: Get all landings
 *     tags: [Landing]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of landings
 */
router.get("/", checkJWT, (req, res, next) => landingController.getAllLandings(req, res, next));

/**
 * @swagger
 * /api/landings/{id}:
 *   put:
 *     summary: Update a landing by ID
 *     tags: [Landing]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Landing ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Landing updated
 *       404:
 *         description: Landing not found
 *       400:
 *         description: Validation failed
 */
router.put("/:id", checkJWT, (req, res, next) => checkRole(req as EncodedRequest, res, next), (req, res, next) => landingController.updateLanding(req, res, next));

/**
 * @swagger
 * /api/landings/{id}:
 *   delete:
 *     summary: Delete a landing by ID
 *     tags: [Landing]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Landing ID
 *     responses:
 *       200:
 *         description: Landing deleted
 *       404:
 *         description: Landing not found
 */
router.delete("/:id", checkJWT, (req, res, next) => checkRole(req as EncodedRequest, res, next), (req, res, next) => landingController.deleteLanding(req, res, next));

export default router;
