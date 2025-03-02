import "./styles/index.css";
import { hydrateRoot, createRoot } from "react-dom/client";
import { HelmetProvider } from 'react-helmet-async';
import Home from "./pages/index.tsx";

declare global {
  interface Window {
    __INITIAL_DATA__?: { posts: any[] };
  }
}

document.addEventListener("DOMContentLoaded", () => {
    const rootElement = document.getElementById("root");
    if (!rootElement) throw new Error("Root element not found");
    
    // Check if we have server-rendered content
    const hasInitialData = typeof window.__INITIAL_DATA__ !== 'undefined';
    const initialData = window.__INITIAL_DATA__ || { posts: [] };
    
    // If we have server data, hydrate; otherwise create new root
    if (hasInitialData) {
        console.log("Hydrating server-rendered content");
        hydrateRoot(
            rootElement, 
            <HelmetProvider>
                <Home posts={initialData.posts} />
            </HelmetProvider>
        );
    } else {
        console.log("Rendering client-side only");
        createRoot(rootElement).render(
            <HelmetProvider>
                <Home posts={[]} />
            </HelmetProvider>
        );
    }
});
