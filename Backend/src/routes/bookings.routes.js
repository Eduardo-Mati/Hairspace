import { Router } from "express";
import {
  postBooking,
  getAvailableSlots,
  getBooking,
} from "../controllers/bookings.controller.js";

const router = Router();

// Público — usado pelo app do cliente.
router.get("/available", getAvailableSlots);
router.post("/", postBooking);
router.get("/:id", getBooking);

export default router;
