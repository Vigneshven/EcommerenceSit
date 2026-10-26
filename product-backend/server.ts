import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "../product-backend/routes/authRoutes";
import productRoutes from "../product-backend/routes/productRoutes";
import cartRoutes from "../product-backend/routes/cartRoutes";
import orderRoutes from "../product-backend/routes/orderRoutes";

const app = express();
const PORT = 4000;

app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});
