import "./styles/index.css";
import { createRoot } from "react-dom/client";
import Home from "./pages/index.tsx";

document.addEventListener("DOMContentLoaded", () => {
    const root = createRoot(document.getElementById("root"));
    root.render(<Home />);
});