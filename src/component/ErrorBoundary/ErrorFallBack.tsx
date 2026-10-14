import { type FallbackProps } from "react-error-boundary";

function ErrorFallBack({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex flex-1 flex-col justify-center items-center mt-60 gap-6">
      <h2 className="text-3xl text-red">Something went wrong</h2>
      <button className="w-50 border-border bg-primary-light" onClick={resetErrorBoundary}>Try Again</button>
    </div>
  );
}

export default ErrorFallBack;
