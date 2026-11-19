export type GuestSessionRow = {
  guest_id: string;
  csrf_token: string;
  expires_at: string;
  revoked_at: Date | null;
};

export type CsrfRow = {
  csrf_token: string;
};
