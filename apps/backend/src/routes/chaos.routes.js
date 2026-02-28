import express from "express";
import { ChaosController } from "../controllers/chaos.controller.js";

const router = express.Router();

router.post("/toggle", ChaosController.toggle);
router.get("/mode", ChaosController.getMode);

export default router;
