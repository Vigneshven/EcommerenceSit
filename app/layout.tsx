import ThemeInitializer from "@/components/ThemeInitializer";
import "./globals.css";
import { Toaster } from "sonner";
import LayoutProps from "@/type/LayoutProps";

export default function RootLayout({ children }: LayoutProps) {
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
