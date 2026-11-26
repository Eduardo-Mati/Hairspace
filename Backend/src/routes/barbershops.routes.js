import { Router } from "express";
import {
  getBarbershop,
  listBarbershops,
} from "../controllers/barbershops.controller.js";

const router = Router();

router.get("/", listBarbershops);
router.get("/:id", getBarbershop);

export default router;
