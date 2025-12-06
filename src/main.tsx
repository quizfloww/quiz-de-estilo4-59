import { createRoot } from "react-dom/client";
// Sentry init (opcional, apenas se DSN definido)
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
if (SENTRY_DSN) {
  // Import dinâmico para não incluir quando não configurado
  import("@sentry/react").then((Sentry) => {
    import("@sentry/integrations").then(({ Replay }) => {
      Sentry.init({
        dsn: SENTRY_DSN,
        integrations: [new Replay()],
        tracesSampleRate: 0.2,
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
      });
    });
  });
}
import App from "./App";
import "./index.css";

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
