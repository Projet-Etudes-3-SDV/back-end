import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { EncodedRequest } from "../utils/EncodedRequest";

const router = Router();
const productController = new ProductController();

router.post("/", (req, res, next) => productController.createProduct(req, res, next));
router.get("/:id", (req, res, next) => productController.getProduct(req as unknown as EncodedRequest, res, next));
router.get("/", (req, res, next) => productController.getProducts(req as EncodedRequest, res, next));
router.put("/:id", (req, res, next) => productController.updateProduct(req as unknown as EncodedRequest, res, next));
router.delete("/:id", (req, res, next) => productController.deleteProduct(req as unknown as EncodedRequest, res, next));

export default router;