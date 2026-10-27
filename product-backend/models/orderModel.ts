import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db";

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

export async function getOrdersByUser(userId: number) {
  const [row] = await pool.execute<OrderRow[]>(
    `select order_id,user_id,name,address,product,cost,date_time
            from orders
            where user_id=?
            order by date_time`,
    [userId],
  );

  return row;
}

export async function getGuestOrder(guestId: string) {
  const [row] = await pool.execute<OrderRow[]>(
    `select order_id,user_id,name,address,product,cost,date_time
            from orders
            where guest_id=? and user_id is null
            order by date_time`,
    [guestId],
  );
  return row;
}

export async function createOrder(data: {
  userId: number | null;
  guestId: string | null;
  name: string;
  address: string;
  product: OrderProduct[];
  cost: number;
}) {
  const [rows] = await pool.execute<ResultSetHeader>(
    `INSERT INTO orders (user_id,guest_id,name, address, product, cost)
       VALUES (?,?,?,?, ?, ?)`,
    [
      data.userId,
      data.guestId,
      data.name.trim(),
      data.address.trim(),
      JSON.stringify(data.product),
      data.cost,
    ],
  );
  return rows.insertId;
}
