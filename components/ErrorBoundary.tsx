"use client";

import { ErrorBoundary } from "react-error-boundary";

export default function AppErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary
      fallbackRender={({ resetErrorBoundary }) => (
        <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
          <h1 className="text-3xl font-bold text-heading">
            Something went wrong
          </h1>

          <p className="text-text-light">Please try again.</p>

          <button
            onClick={resetErrorBoundary}
            className="rounded-2xl bg-primary px-6 py-3 font-bold text-on-primary"
          >
            Try again
          </button>
        </main>
      )}
      onError={(error) => console.error(error)}
    >
      {children}
    </ErrorBoundary>
  );
}
