import { Router } from "express";
import { ProductController } from "../controllers/product.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { createProductSchema, updateProductSchema } from "../middleware/validators/product.validator.js";

const router = Router();

router.get("/", ProductController.list);
router.post("/", validate(createProductSchema), ProductController.create);
router.get("/:id", ProductController.getOne);
router.patch("/:id", validate(updateProductSchema), ProductController.update);
router.delete("/:id", ProductController.delete);

export default router;
