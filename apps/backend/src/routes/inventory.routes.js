import express from "express";
import * as inventoryController from "../controllers/inventory.controller.js";

const router = express.Router();

router.get("/", inventoryController.getItems);
router.post("/", inventoryController.createItem);
router.get("/:id", inventoryController.getItem);
router.put("/:id", inventoryController.updateItem);
router.delete("/:id", inventoryController.deleteItem);

export default router;
