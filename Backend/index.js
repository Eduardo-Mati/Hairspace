import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import servicesRoutes from "./src/routes/services.routes.js";
import portfolioRoutes from "./src/routes/portfolio.routes.js";
import productsRoutes from "./src/routes/products.routes.js";
import bookingsRoutes from "./src/routes/bookings.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import { errorHandler } from "./src/middlewares/errorHandler.middleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));

// index.js só monta os routers — nenhuma lógica de negócio nem query aqui.
app.use("/services", servicesRoutes);
app.use("/portfolio", portfolioRoutes);
app.use("/products", productsRoutes);
app.use("/bookings", bookingsRoutes);
app.use("/auth", authRoutes);

// Sempre por último: captura erros passados via next(err) em qualquer controller.
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor rodando no endereço http://localhost:${PORT}`);
});
