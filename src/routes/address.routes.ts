import { Router } from "express";
import { AddressController } from "../controllers/address.controller";

const router = Router();
const addressController = new AddressController();

router.post("/", addressController.createAddress.bind(addressController));
router.get("/:id", addressController.getAddress.bind(addressController));
router.put("/:id", addressController.updateAddress.bind(addressController));
router.delete("/:id", addressController.deleteAddress.bind(addressController));

export default router;
