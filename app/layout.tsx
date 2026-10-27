"use client";

import ThemeInitializer from "@/components/ThemeInitializer";
import "./globals.css";
import { Toaster } from "sonner";
import "react-loading-skeleton/dist/skeleton.css";
import { SkeletonTheme } from "react-loading-skeleton";
import AppErrorBoundary from "@/components/ErrorBoundary";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html>
      <body>
        <SkeletonTheme baseColor="#f0f6ff">
          <AppErrorBoundary>{children}</AppErrorBoundary>
        </SkeletonTheme>
        <Toaster position="top-right" richColors />
        <ThemeInitializer />
      </body>
    </html>
  );
}
