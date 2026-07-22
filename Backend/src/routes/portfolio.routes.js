import { Router } from "express";
import { listPortfolio } from "../controllers/portfolio.controller.js";

const router = Router();

router.get("/", listPortfolio);

export default router;
