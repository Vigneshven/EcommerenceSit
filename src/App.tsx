import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "sonner";
import useThemeStore from "./zustandStore/themeStore";

function App() {

  const mode = useThemeStore((state) => state.mode);

  return (
    <div className={mode === "dark" ? "dark min-h-screen" : "min-h-screen"}>
      <Toaster position="top-center" richColors />
      <div className="min-h-screen bg-page-background text-body-text">
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
