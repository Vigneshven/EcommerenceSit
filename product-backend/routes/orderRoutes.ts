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
    const userId = Number(req.query.userId);
    const guest = req.query.guest === "true";

    let rows: OrderRow[];

    if (guest) {
      const [guestRow] = await pool.execute<OrderRow[]>(
        `select order_id,user_id,name,address,product,cost,date_time
            from orders
            where guest_id=? and user_id is null
            order by date_time`,
        ["0"],
      );
      rows = guestRow;
    } else {
      const [userRow] = await pool.execute<OrderRow[]>(
        `select order_id,user_id,name,address,product,cost,date_time
            from orders
            where user_id=?
            order by date_time`,
        [userId],
      );
      rows = userRow;
    }

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
    const { userId, guestId, name, address, product, cost } = req.body;

    const isLoginUser =
      Number.isInteger(userId) && userId > 0 && guestId == null;

    const isguest = userId == null && guestId == "0";

    if (!isLoginUser && !isguest)
      return res
        .status(401)
        .json({ message: "please login or enter guest mode" });

    if (
      (userId !== null && (!Number.isInteger(userId) || userId <= 0)) ||
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
      `INSERT INTO orders (user_id,guest_id,name, address, product, cost)
       VALUES (?,?,?,?, ?, ?)`,
      [
        userId,
        guestId,
        name.trim(),
        address.trim(),
        JSON.stringify(product),
        cost,
      ],
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
