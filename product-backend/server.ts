import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "../product-backend/routes/authRoutes";
import productRoutes from "../product-backend/routes/productRoutes";
import cartRoutes from "../product-backend/routes/cartRoutes";
import orderRoutes from "../product-backend/routes/orderRoutes";
import guestCartRoutes from "../product-backend/routes/guestCartRoutes";
import guestOrderRoutes from "../product-backend/routes/guestOrderRoutes";
import guestSessionRoutes from "../product-backend/routes/guestSessionRoutes";
import { generalApiLimiter } from "./middleware/rateLimit";

const app = express();
const PORT = 4000;

app.use("/api", generalApiLimiter);
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
app.use(
  cors({
    // origin: [
    //   "http://localhost:3000",
    //   "http://127.0.0.1:3000",
    //   "http://192.168.1.12:3000",
    // ],
    origin: "http://localhost:3000",
    credentials: true,
  }),
);


app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/guest", guestSessionRoutes);
app.use("/api/cart/guest", guestCartRoutes);
app.use("/api/order/guest", guestOrderRoutes);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`server running on http://localhost:${PORT}`);
});
