import "./styles/index.css";
import { createRoot } from "react-dom/client";
import Home from "./pages/index.tsx";

document.addEventListener("DOMContentLoaded", () => {
    const rootElement = document.getElementById("root");
    if (!rootElement) throw new Error("Root element not found");
    const root = createRoot(rootElement);
    root.render(<Home />);
});