import ThemeInitializer from "@/components/ThemeInitializer";
import "./globals.css";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <main>{children}</main>
        <Toaster position="top-center" richColors />
        <ThemeInitializer />
      </body>
    </html>
  );
}
