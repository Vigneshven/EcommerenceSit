import RouteGuard from "@/components/RouteGuard";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard type="protected" allowGuest>
      {children}
    </RouteGuard>
  );
}
