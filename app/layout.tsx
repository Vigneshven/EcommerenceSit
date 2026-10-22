"use client";

import ThemeInitializer from "@/components/ThemeInitializer";
import "./globals.css";
import { Toaster } from "sonner";
import "react-loading-skeleton/dist/skeleton.css";
import { SkeletonTheme } from "react-loading-skeleton";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html>
      <body>
        <SkeletonTheme baseColor="#f0f6ff">
          {children}
        </SkeletonTheme>
        <Toaster position="top-center" richColors />
        <ThemeInitializer />
      </body>
    </html>
  );
}
