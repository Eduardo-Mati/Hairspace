import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";
import {
  getAdminBarbershop,
  listAdminBookings,
  patchAdminBarbershop,
  patchAdminBookingStatus,
} from "../controllers/admin.controller.js";

const router = Router();

router.use(requireAuth, requireRole("admin"));
router.get("/barbershop", getAdminBarbershop);
router.patch("/barbershop", patchAdminBarbershop);
router.get("/bookings", listAdminBookings);
router.patch("/bookings/:id/status", patchAdminBookingStatus);

export default router;
