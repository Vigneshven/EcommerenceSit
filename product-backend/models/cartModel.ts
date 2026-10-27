import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db";

export type CartOwner =
  | { column: "user_id"; value: number }
  | { column: "guest_id"; value: string };

function validateOwner(owner: CartOwner): void {
  if (
    owner.column === "user_id" &&
    (!Number.isInteger(owner.value) || owner.value <= 0)
  ) {
    throw new Error("Invalid user cart owner");
  }

  if (
    owner.column === "guest_id" &&
    (typeof owner.value !== "string" || !owner.value.trim())
  ) {
    throw new Error("Invalid guest cart owner");
  }
}

function ownerCondition(owner: CartOwner): string {
  validateOwner(owner);

  if (owner.column === "user_id") {
    return "ci.user_id=?";
  }

  return "ci.user_id is null and ci.guest_id=?";
}

export async function getCartItems(owner: CartOwner) {
  const condition = ownerCondition(owner);

  const [rows] = await pool.query<RowDataPacket[]>(
    `
            select ci.cart_item_id as cartItemId,ci.product_id as id,ci.quantity as amount,ci.color,
            p.image,p.name,p.company,p.category,p.description,p.price,p.free_shipping
            from cart_items ci
            join products p on p.id = ci.product_id
            where ${condition}
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
  validateOwner(owner);
  const [row] = await pool.query<RowDataPacket[]>(
    `insert into cart_items(user_id,
            guest_id,product_id,quantity,color) values(?,?,?,?,?) on duplicate key update
            quantity = least(100,quantity+values(quantity))
            `,
    [
      owner.column === "user_id" ? owner.value : null,
      owner.column === "guest_id" ? owner.value : null,
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
  validateOwner(owner);
  const condition =
    owner.column === "user_id" ? "user_id=?" : "user_id is null and guest_id=?";
  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE cart_items
     SET quantity = ?
     WHERE cart_item_id = ? AND ${condition}`,
    [quantity, cartItemId, owner.value],
  );

  return result;
}

export async function deleteCartItem(owner: CartOwner, cartItemId: number) {
  validateOwner(owner);
  const condition =
    owner.column === "user_id" ? "user_id=?" : "user_id is null and guest_id=?";
  const [result] = await pool.query<ResultSetHeader>(
    `DELETE FROM cart_items
     WHERE cart_item_id = ? AND ${condition}`,
    [cartItemId, owner.value],
  );

  return result;
}
