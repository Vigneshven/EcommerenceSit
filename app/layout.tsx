"use client";

import "./globals.css";
import { Toaster } from "sonner";
import "react-loading-skeleton/dist/skeleton.css";
import { SkeletonTheme } from "react-loading-skeleton";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import AppErrorBoundary from "@/components/ErrorBoundary";
import ThemeInitializer from "@/components/ThemeInitializer";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html className={cn("font-sans", geist.variable)}>
      <body>
        <SkeletonTheme baseColor="#f0f6ff">
          <AppErrorBoundary>{children}</AppErrorBoundary>
        </SkeletonTheme>
        <Toaster position="bottom-right" richColors />
        <ThemeInitializer />
      </body>
    </html>
  );
}
