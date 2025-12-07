import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Inicializar sistemas de monitoramento
// Sentry desabilitado até configurar VITE_SENTRY_DSN
// import "./utils/sentry";
import "./utils/googleAnalytics";
import "./utils/performanceMonitoring";

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
