import { Router } from "express";
import pool from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export type OrderProduct = {
  id: number;
  name: string;
  amount: number;
  price: string;
  color: string;
};

export type OrderRow = RowDataPacket & {
  order_id: number;
  name: string;
  address: string;
  product: OrderProduct[] | string;
  cost: string | number;
  date_time: string;
};

const router = Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query<OrderRow[]>(
      `select order_id,name,address,product,cost,date_time
            from orders
            order by date_time desc`,
    );

    const orders = rows.map((row) => ({
      id: row.order_id,
      name: row.name,
      address: row.address,
      product:
        typeof row.product === "string" ? JSON.parse(row.product) : row.product,
      cost: Number(row.cost),
      dateTime: row.date_time,
    }));

    return res.json(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "failed to fetch orders",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, address, product, cost } = req.body;

    if (
      typeof name !== "string" ||
      name.trim().length < 3 ||
      typeof address !== "string" ||
      address.trim().length < 5 ||
      !Array.isArray(product) ||
      product.length === 0 ||
      !Number.isFinite(cost) ||
      cost < 0
    ) {
      return res.status(400).json({
        message: "Invalid order details",
      });
    }

    const [rows] = await pool.execute<ResultSetHeader>(
      `INSERT INTO orders (name, address, product, cost)
       VALUES (?, ?, ?, ?)`,
      [name.trim(), address.trim(), JSON.stringify(product), cost],
    );

    return res.status(201).json({
      message: "Order placed successfully",
      id: rows.insertId,
    });
  } catch (error) {
    console.error("Place order error:", error);
    return res.status(500).json({
      message: "Failed to place order",
    });
  }
});

export default router;
