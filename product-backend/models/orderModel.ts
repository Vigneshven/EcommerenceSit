import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db";

export type OrderProduct = {
  id: number;
  name: string;
  amount: number;
  price: string | number;
  color: string;
};

type ProductRow = RowDataPacket & {
  id: number;
  name: string;
  price: string | number;
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
}) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const ownerCondition = data.userId !== null ? "ci.user_id=?" : "ci.user_id is null and ci.guest_id=?";
    const deleteOwnerCondition = data.userId !== null ? "user_id=?" : "user_id is null and guest_id=?";
    const ownerValue = data.userId !== null ? data.userId : data.guestId;
    const [cartProducts] = await connection.execute<ProductRow[] & {
      cart_item_id: number;
      amount: number;
      color: string;
    }[]>(
      `select ci.cart_item_id, ci.quantity as amount, ci.color,
              p.id, p.name, p.price
       from cart_items ci
       join products p on p.id=ci.product_id
       where ${ownerCondition}
       for update`,
      [ownerValue],
    );

    if (!cartProducts.length) {
      throw new Error("Order must contains at least one product");
    }

    const orderProducts: OrderProduct[] = cartProducts.map((item) => {
      const price = Number(item.price);

      if (!Number.isFinite(price) || price < 0) {
        throw new Error("Invalid product price in db");
      }
      return {
        id: item.id,
        name: item.name,
        amount: item.amount,
        price: price,
        color: item.color,
      };
    });

    const subtotal = orderProducts.reduce(
      (sum, item) => sum + Number(item.price) * item.amount,
      0,
    );

    const tax = subtotal * 0.1;
    const shipping = subtotal > 0 && subtotal < 1000 ? 15 : 0;
    const cost = Number(subtotal + tax + shipping);
    const [rows] = await connection.execute<ResultSetHeader>(
      `INSERT INTO orders (user_id,guest_id,name, address, product, cost)
         VALUES (?,?,?,?,?,?)`,
      [
        data.userId,
        data.guestId,
        data.name.trim(),
        data.address.trim(),
        JSON.stringify(orderProducts),
        cost,
      ],
    );
    await connection.execute(
      `delete from cart_items where ${deleteOwnerCondition}`,
      [ownerValue],
    );
    await connection.commit();

    return {
      orderId: rows.insertId,
      product: orderProducts,
      subtotal: Number(subtotal),
      tax: Number(tax),
      shipping,
      cost,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
