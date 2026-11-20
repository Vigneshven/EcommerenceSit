import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import cartRoutes from "./routes/cartRoutes";
import orderRoutes from "./routes/orderRoutes";
import guestCartRoutes from "./routes/guestCartRoutes";
import guestOrderRoutes from "./routes/guestOrderRoutes";
import guestSessionRoutes from "./routes/guestSessionRoutes";
import { generalApiLimiter } from "./middleware/rateLimit";
import paymentRoutes from "./routes/paymentRoutes";
import { stripeWebHook } from "./controllers/stripeWebHookController";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const FRONTENDPORT = Number(process.env.FRONTENDPORT) || 3000;

app.use(helmet());
app.disable("x-powered-by");
app.use(
  cors({
    origin: `http://localhost:${FRONTENDPORT}`,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  stripeWebHook,
);
app.use(express.json());
app.use("/api/payment", paymentRoutes);
app.use("/", generalApiLimiter);

const root = express.Router();
app.use("/api", root);
root.use("/auth", authRoutes);
root.use("/products", productRoutes);
root.use("/cart/guest", guestCartRoutes);
root.use("/cart", cartRoutes);
root.use("/order", orderRoutes);
root.use("/guest", guestSessionRoutes);
root.use("/order/guest", guestOrderRoutes);

app.use((_, response) => {
  return response.status(404).json({
    message: "Resource not found",
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`server running on http://localhost:${PORT}`);
});
