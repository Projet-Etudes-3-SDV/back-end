import { Router } from "express";
import { InvoiceController } from "../controllers/invoice.controller";
import { checkJWT } from "../middlewares/auth.middleware";
import { EncodedRequest } from "../utils/EncodedRequest";

const router = Router();
const invoiceController = new InvoiceController();

router.get("/:subscriptionId", checkJWT, (req, res, next) => invoiceController.generateAndSendInvoice(req as EncodedRequest, res, next));

export default router;