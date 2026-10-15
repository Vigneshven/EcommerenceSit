import ThemeInitializer from "@/components/ThemeInitializer";
import Account from "../components/Account";
import Header from "../components/Header";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <Header />
        <Account />
        <main>{children}</main>
        <ThemeInitializer />
      </body>
    </html>
  );
}
