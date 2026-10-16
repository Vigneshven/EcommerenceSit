import express from "express";
import cors = require("cors");
import { Product } from "../type/Product";
import authRoutes from "../product-backend/routes/authRoutes";
import productRoutes from "../product-backend/routes/productRoutes";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});
