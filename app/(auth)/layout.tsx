import LayoutProps from "@/type/LayoutProps";
export default function AuthLayout({ children }: LayoutProps) {
  return (
    <div className="auth-container">
      <main>{children}</main>
    </div>
  );
}
