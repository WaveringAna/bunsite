import "./styles/index.css";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from 'react-helmet-async';
import { PostHogProvider} from 'posthog-js/react'
import type { PostHogConfig } from "posthog-js";
import Home from "./pages/index.tsx";

const PostHogOptions: Partial<PostHogConfig> = {
    api_host: "https://us.i.posthog.com",
}

const PostHogPublicApiKey = "phc_RHkxs5vQwyeo5NbXKNtWckcnvKR4CJPpxAKZ9rBKv9R"

document.addEventListener("DOMContentLoaded", () => {
    const rootElement = document.getElementById("root");
    if (!rootElement) throw new Error("Root element not found");
    
    createRoot(rootElement).render(
        <PostHogProvider options={PostHogOptions} apiKey={PostHogPublicApiKey}>
            <HelmetProvider>
                <Home />
            </HelmetProvider>
        </PostHogProvider>
    );
});
