import { prisma } from "../lib/prisma";

export async function findValidGuestSession(tokenHash: string) {
  // const [rows] = await pool.execute<GuestSessionRow[]>(
  //   `select guest_id,csrf_token,expires_at,revoked_at
  //       from guest_sessions
  //       where token_hash=?
  //       and revoked_at is null
  //       and expires_at > utc_timestamp() limit 1
  //       `,
  //   [tokenHash],
  // );
  // return rows[0] ?? null;

  return prisma.guest_sessions.findFirst({
    where: {
      token_hash: tokenHash,
      revoked_at: null,
      expires_at: {
        gt: new Date(),
      },
    },
    select: {
      guest_id: true,
      csrf_token: true,
      expires_at: true,
      revoked_at: true,
    },
  });
}

export async function updateGuestSession(guestId: string, tokenHash: string) {
  // await pool.execute(
  //   `update guest_sessions
  //       set last_seen_at = utc_timestamp()
  //       where guest_id = ?
  //       and token_hash=?
  //        and revoked_at is null`,
  //   [guestId, tokenHash],
  // );

  return prisma.guest_sessions.updateMany({
    where: {
      guest_id: guestId,
      token_hash: tokenHash,
      revoked_at: null,
    },
    data: {
      last_seen_at: new Date(),
    },
  });
}

export async function insertGuestSession(
  guestId: string,
  tokenHash: string,
  csrfToken: string,
) {
  // await pool.execute<ResultSetHeader>(
  //   `insert into guest_sessions (guest_id,token_hash,csrf_token,expires_at)
  //    values(?,?,?,date_add(utc_timestamp(),interval 7 day))`,
  //   [guestId, tokenHash, csrfToken],
  // );

  return prisma.guest_sessions.create({
    data: {
      guest_id: guestId,
      token_hash: tokenHash,
      csrf_token: csrfToken,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });
}

export async function revokeGuestSession(
  tokenHash: string,
  csrfToken: string,
): Promise<boolean> {
  // const [result] = await pool.execute<ResultSetHeader>(
  //   `update guest_sessions
  //       set revoked_at = utc_timestamp()
  //       where token_hash=? and csrf_token=? and revoked_at is null`,
  //   [tokenHash, csrfToken],
  // );

  // return result.affectedRows > 0;

  const res = await prisma.guest_sessions.updateMany({
    where: {
      token_hash: tokenHash,
      csrf_token: csrfToken,
      revoked_at: null,
    },
    data: {
      revoked_at: new Date(),
    },
  });

  return res.count > 0;
}
