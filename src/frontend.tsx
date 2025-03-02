import "./styles/index.css";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from 'react-helmet-async';
import Home from "./pages/index.tsx";

document.addEventListener("DOMContentLoaded", () => {
    const rootElement = document.getElementById("root");
    if (!rootElement) throw new Error("Root element not found");
    
    createRoot(rootElement).render(
        <HelmetProvider>
            <Home />
        </HelmetProvider>
    );
});
