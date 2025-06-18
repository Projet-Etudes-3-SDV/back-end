import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { checkJWT, checkRole } from "../middlewares/auth.middleware";
import { EncodedRequest } from "../utils/EncodedRequest";

const router = Router();
const orderController = new OrderController();

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Créer une nouvelle commande
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderToCreate'
 *     responses:
 *       201:
 *         description: Commande créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderPresenter'
 *       400:
 *         description: Erreur de validation
 */
router.post(
  "/",
  checkJWT,
  (req, res, next) => checkRole(req as EncodedRequest, res, next),
  (req, res, next) => orderController.createOrder(req, res, next)
);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Récupérer la liste des commandes
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [orderDate, total, status]
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Liste des commandes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/OrderPresenter'
 *                 total:
 *                   type: integer
 */
router.get(
  "/",
  checkJWT,
  (req, res, next) => checkRole(req as EncodedRequest, res, next),
  (req, res, next) => orderController.getOrders(req, res, next)
);

/**
 * @swagger
 * /orders/me:
 *   get:
 *     summary: Récupérer les commandes de l'utilisateur connecté
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [orderDate, total, status]
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Liste des commandes de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/OrderPresenter'
 *                 total:
 *                   type: integer
 */
router.get("/me", checkJWT, (req, res, next) => orderController.getOrdersByUser(req as EncodedRequest, res, next));

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Récupérer une commande par ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Commande trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderPresenter'
 *       404:
 *         description: Commande non trouvée
 */
router.get("/:id", checkJWT, (req, res, next) => orderController.getOrder(req, res, next));

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Récupérer une commande par ID de session
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Commande trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderPresenter'
 *       404:
 *         description: Commande non trouvée
 */
router.get("/by-session/:sessionId", checkJWT, (req, res, next) => orderController.getOrderBySession(req, res, next));


/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Modifier une commande existante
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderToModify'
 *     responses:
 *       200:
 *         description: Commande modifiée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderPresenter'
 *       400:
 *         description: Erreur de validation
 *       404:
 *         description: Commande non trouvée
 */
router.put(
  "/:id",
  checkJWT,
  (req, res, next) => checkRole(req as EncodedRequest, res, next),
  (req, res, next) => orderController.updateOrder(req, res, next)
);

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Supprimer une commande
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Commande supprimée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Commande non trouvée
 */
router.delete(
  "/:id",
  checkJWT,
  (req, res, next) => checkRole(req as EncodedRequest, res, next),
  (req, res, next) => orderController.deleteOrder(req, res, next)
);

export default router;
