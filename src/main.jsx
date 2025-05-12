import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async"; // Add this
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <HelmetProvider> {/* Wrap everything with HelmetProvider */}
      <Router>
        <App />
      </Router>
    </HelmetProvider>
  </React.StrictMode>
);

