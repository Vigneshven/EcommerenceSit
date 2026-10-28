import { RowDataPacket } from "mysql2";

export type GuestSessionRow = RowDataPacket & {
  guest_id: string;
  csrf_token: string;
  expires_at: string;
  revoke_at: Date | null;
};

export type CsrfRow = RowDataPacket & {
  csrf_token: string;
};
