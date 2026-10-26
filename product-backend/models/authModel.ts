import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db";

export type UserRow = RowDataPacket & {
  id: number;
  username: string;
  email: string;
  password: string;
};

export async function findUserByEmail(email: string) {
  const [rows] = await pool.execute<UserRow[]>(
    "select id,username,email,password from users where email=?",
    [email],
  );

  return rows[0] ?? null;
}

export async function updatePasswordByHash(
  userId: number,
  passwordHash: string,
): Promise<void> {
  await pool.execute(`update users set password=? where id=?`, [
    userId,
    passwordHash,
  ]);
}

export async function createUser(
  username: string,
  email: string,
  passwordHash: string,
) {
  const [rows] = await pool.execute<ResultSetHeader>(
    "insert into users (username,email,password) values (?,?,?)",
    [username, email, passwordHash],
  );

  return rows.insertId;
}
