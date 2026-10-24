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

export async function createUser(
  username: string,
  email: string,
  password: string,
) {
  const [rows] = await pool.execute<ResultSetHeader>(
    "insert into users (username,email,password) values (?,?,?)",
    [username, email, password],
  );

  return rows.insertId;
}

// session

interface SessionRow extends RowDataPacket {
  active_session_id: string | null;
}

export async function getActiveSession(userId: number) {
  const [rows] = await pool.execute<SessionRow[]>(
    `select active_session_id from users where id=?`,
    [userId],
  );

  return rows[0]?.active_session_id ?? null;
}

export async function updateActiveSession(userId: number, sessionId: string) {
  await pool.execute(`update users set active_session_id=? where id=?`, [
    sessionId,
    userId,
  ]);
}
