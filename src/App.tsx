import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "sonner";
import useThemeStore from "./zustandStore/themeStore";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallBack from "./component/ErrorBoundary/ErrorFallBack";

function App() {
  const mode = useThemeStore((state) => state.mode);

  return (
    <div className={mode === "dark" ? "dark min-h-screen" : "min-h-screen"}>
      <Toaster position="top-center" richColors />
      <div className="min-h-screen bg-page-background text-body-text">
        <ErrorBoundary
          FallbackComponent={ErrorFallBack}
          onReset={() => {
            window.location.href = "/";
          }}
        ></ErrorBoundary>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
