import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { GlobalProvider } from "./context/Context.tsx";
import "./i18n";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GlobalProvider initialOrganization="Balmer" initialTheme="dark">
      <App />
    </GlobalProvider>
  </StrictMode>,
);
