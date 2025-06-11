import { Router } from "express";
import { uploadProductImage, uploadCategoryImage } from "../controllers/upload.controller";
import { checkJWT, checkRole } from "../middlewares/auth.middleware";
import { EncodedRequest } from "../utils/EncodedRequest";

const router = Router();

router.post("/product/:id", checkJWT, (req, res, next) => checkRole(req as EncodedRequest, res, next), uploadProductImage);
router.post("/category/:id", checkJWT, (req, res, next) => checkRole(req as EncodedRequest, res, next), uploadCategoryImage);

export default router;
