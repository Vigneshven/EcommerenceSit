// CSRF TOKEN

export default function getGuestCsrfToken(): string | null {
  if (typeof document === "undefined") return null;

  const item = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("guest_csrf="));

  return item ? decodeURIComponent(item.substring("guest_csrf=".length)) : null;
}
