import { Router, type Request, type Response } from "express";
import pool from "../config/db";
import { RowDataPacket } from "mysql2";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(`
            select id,image,name,category,company,price,description,amount,free_shipping
            from products
            order by id
            `);

    const products = rows.map((product) => ({
      ...product,
      price: `$${Number(product.price)}`,
      amount: String(product.amount),
      free_shipping: Boolean(product.free_shipping),
    }));

    res.json(products);
  } catch (error) {
    console.log("failed to fetch product", error);
    res.status(500).json({
      message: "failed to fetch products",
    });
  }
});

router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const id = Number(req.params.id);

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "select * from products where id=?",
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Product Not found",
      });
    }
    res.json(rows[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to fetch product",
    });
  }
});

export default router;
