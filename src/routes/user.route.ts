import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { EncodedRequest } from "../utils/EncodedRequest";

const router = Router();
const userController = new UserController();

router.post("/", (req, res, next) => userController.createUser(req, res, next));
router.post("/login", (req, res, next) => userController.login(req, res, next));
router.post("/refresh", (req, res, next) => userController.refresh(req, res, next));
router.get("/:id", (req, res, next) => userController.getUser(req as unknown as EncodedRequest, res, next));
router.get("/", (req, res, next) => userController.getUsers(req as EncodedRequest, res, next));
router.put("/:id", (req, res, next) => userController.updateUser(req, res, next));
router.delete("/:id", (req, res, next) => userController.deleteUser(req, res, next));
router.patch("/:id", (req, res, next) => userController.patchUser(req, res, next));

export default router;