import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db";

export type CartOwner =
  | { column: "user_id"; value: number }
  | { column: "guest_id"; value: string };

export async function getCartItems(owner: CartOwner) {
  const [rows] = await pool.query<RowDataPacket[]>(
    `
            select ci.cart_item_id as cartItemId,ci.product_id as id,ci.quantity as amount,ci.color,
            p.image,p.name,p.company,p.category,p.description,p.price,p.free_shipping
            from cart_items ci
            join products p on p.id = ci.product_id
            where ci.${owner.column}=?
            order by ci.created_at desc
            `,
    [owner.value],
  );

  return rows;
}

export async function addCartItems(data: {
  owner: CartOwner;
  productId: number;
  quantity: number;
  color: string;
}) {
  const { owner, productId, quantity, color } = data;
  const [row] = await pool.query<RowDataPacket[]>(
    `insert into cart_items(user_id,
            guest_id,product_id,quantity,color) values(?,?,?,?,?) on duplicate key update
            quantity = least(100,quantity+values(quantity))
            `,
    [
      owner.column === "user_id" ? owner.value : null,
      owner.column === "guest_id" ? String(owner.value) : null,
      productId,
      quantity,
      color.trim(),
    ],
  );
  return row;
}

export async function updateCartItem(
  owner: CartOwner,
  cartItemId: number,
  quantity: number,
) {
  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE cart_items
     SET quantity = ?
     WHERE cart_item_id = ? AND ${owner.column} = ?`,
    [quantity, cartItemId, owner.value],
  );

  return result;
}

export async function deleteCartItem(owner: CartOwner, cartItemId: number) {
  const [result] = await pool.query<ResultSetHeader>(
    `DELETE FROM cart_items
     WHERE cart_item_id = ? AND ${owner.column} = ?`,
    [cartItemId, owner.value],
  );

  return result;
}
