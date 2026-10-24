import { getAllProducts, getProductById } from "../models/productModels";
import { type Request, type Response } from "express";

export async function getProducts(req: Request, res: Response) {
  try {
    const rows = await getAllProducts();

    const products = rows.map((product) => ({
      ...product,
      price: `$${Number(product.price)}`,
      amount: String(product.amount),
      free_shipping: Boolean(product.free_shipping),
    }));

    return res.json(products);
  } catch {
    return res.status(500).json({
      message: "failed to fetch products",
    });
  }
}

export async function getProduct(req: Request<{ id: string }>, res: Response) {
  try {
    const id = Number(req.params.id);

    const product = await getProductById(id);
    if (!product) {
      return res.status(404).json({
        message: "Product Not found",
      });
    }
    return res.json(product);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to fetch product",
    });
  }
}
