import RouteGuard from "@/components/RouteGuard";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="auth-container">
      <RouteGuard type="public" allowGuest>
        {children}
      </RouteGuard>
    </div>
  );
}
