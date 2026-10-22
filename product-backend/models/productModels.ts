import { RowDataPacket } from "mysql2";
import pool from "../config/db";

export async function getAllProducts() {
  const [rows] = await pool.query<RowDataPacket[]>(`
            select id,image,name,category,company,price,description,amount,free_shipping
            from products
            order by id
            `);

  return rows;
}

export async function getProductById(id: number) {
  const [rows] = await pool.query<RowDataPacket[]>(
    "select * from products where id=?",
    [id],
  );

  return rows[0] ?? null;
}
