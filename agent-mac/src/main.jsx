import React, { useLayoutEffect } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./styles.css";
import "./afterglow.css";
import "./pricing.css";
import "./scenes.css";
import "./devices.css";
import "./motion.css";
import "./commerce/commerce.css";

function MountedApp() {
  useLayoutEffect(() => {
    document.getElementById("root").removeAttribute("data-prerendered");
    document.documentElement.removeAttribute("data-app-route");
  }, []);
  return <App />;
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MountedApp />
  </React.StrictMode>,
);
