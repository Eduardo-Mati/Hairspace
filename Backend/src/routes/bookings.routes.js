import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  postBooking,
  getAvailableSlots,
  getBooking,
  listBookings,
  patchBookingStatus,
} from "../controllers/bookings.controller.js";

const router = Router();

// Público — usado pelo app do cliente
router.get("/available", getAvailableSlots); // /bookings/available?date=2026-08-01
router.post("/", postBooking);
router.get("/:id", getBooking);

// Autenticado — usado pelo painel do barbeiro
router.get("/", requireAuth, listBookings);
router.patch("/:id/status", requireAuth, patchBookingStatus);

export default router;
