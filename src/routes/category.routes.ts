import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";

const router = Router();
const categoryController = new CategoryController();

router.post("/", categoryController.createCategory.bind(categoryController));
router.get("/:id", categoryController.getCategory.bind(categoryController));
router.get("/", categoryController.getCategories.bind(categoryController));
router.put("/:id", categoryController.updateCategory.bind(categoryController));
router.delete("/:id", categoryController.deleteCategory.bind(categoryController));

export default router;
