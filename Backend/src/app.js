import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import servicesRoutes from "./routes/services.routes.js";
import portfolioRoutes from "./routes/portfolio.routes.js";
import productsRoutes from "./routes/products.routes.js";
import bookingsRoutes from "./routes/bookings.routes.js";
import authRoutes from "./routes/auth.routes.js";
import barbershopsRoutes from "./routes/barbershops.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/services", servicesRoutes);
app.use("/portfolio", portfolioRoutes);
app.use("/products", productsRoutes);
app.use("/bookings", bookingsRoutes);
app.use("/auth", authRoutes);
app.use("/barbershops", barbershopsRoutes);
app.use("/admin", adminRoutes);

app.use(errorHandler);

export default app;
