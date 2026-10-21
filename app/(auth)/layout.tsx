export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="auth-container">
      <main>{children}</main>
    </div>
  );
}
