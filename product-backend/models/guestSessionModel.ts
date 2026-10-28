import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db";

export interface GuestSessionRow extends RowDataPacket {
  guest_id: string;
  token_hash: string;
  csrf_token: string;
  expires_at: Date;
  revoked_at: Date | null;
}

export async function findValidGuestSession(tokenHash: string) {
  const [rows] = await pool.execute<GuestSessionRow[]>(
    `select guest_id,csrf_token,expires_at,revoked_at
        from guest_sessions
        where token_hash=?
        and revoked_at is null
        and expires_at > utc_timestamp() limit 1
        `,
    [tokenHash],
  );
  return rows[0] ?? null;
}

export async function updateGuestSession(guestId: string, tokenHash: string) {
  await pool.execute(
    `update guest_sessions
        set last_seen_at = utc_timestamp()
        where guest_id = ? 
        and token_hash=?
         and revoked_at is null`,
    [guestId, tokenHash],
  );
}

export async function insertGuestSession(
  guestId: string,
  tokenHash: string,
  csrfToken: string,
) {
  await pool.execute<ResultSetHeader>(
    `insert into guest_sessions (guest_id,token_hash,csrf_token,expires_at)
     values(?,?,?,date_add(utc_timestamp(),interval 7 day))`,
    [guestId, tokenHash, csrfToken],
  );
}

export async function revokeGuestSession(
  tokenHash: string,
  csrfToken: string,
): Promise<boolean> {
  const [result] = await pool.execute<ResultSetHeader>(
    `update guest_sessions
        set revoked_at = utc_timestamp()
        where token_hash=? and csrf_token=? and revoked_at is null`,
    [tokenHash, csrfToken],
  );

  return result.affectedRows > 0;
}
