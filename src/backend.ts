import index from "./public/index.html";
import drawingsJson from "../content/drawings.json";
import { getPosts } from "./lib/posts";
import { render, renderPost } from "./lib/ssr";
import { serve } from "bun";
import { build } from "bun";
import { mkdir } from "node:fs/promises";

try {
    await mkdir("./build", { recursive: true });
} catch (error) {
    console.error("Error creating build directory:", error);
}


serve({
    port: 3000,
    routes: {
        "/": index,
        "/favicon.ico": new Response(await Bun.file("./src/public/avatar.jpg").bytes(), {
            headers: {
                "Content-Type": "image/x-icon",
            },
        }),
        "/background.jpg": new Response(await Bun.file("./src/public/background.jpg").bytes(), {
            headers: {
                "Content-Type": "image/jpeg",
            },
        }),
        "/api/posts": async () => {
            try {
                const posts = await getPosts();
                return new Response(JSON.stringify(posts), {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            } catch (error) {
                console.error('Error fetching posts:', error);
                return new Response(JSON.stringify({ error: 'Failed to fetch posts' }), {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            }
        },
        "/api/drawings": Response.json(drawingsJson),
        "/public/*": async (request) => {
            try {
                const url = new URL(request.url);
                const pathname = url.pathname.replace("/public", "");

                // Sanitize path to prevent directory traversal
                const normalizedPath = pathname.split("/").filter(segment => {
                    // Remove empty segments and dangerous patterns
                    return segment !== "" && segment !== "." && segment !== "..";
                }).join("/");

                // Construct the file path
                const filePath = `./src/public/${normalizedPath}`;
                const file = Bun.file(filePath);

                // Check if file exists
                const exists = await file.exists();
                if (!exists) {
                    return new Response("Not Found", { status: 404 });
                }

                // Determine content type based on file extension
                const contentType = getContentType(filePath);

                return new Response(await file.arrayBuffer(), {
                    headers: {
                        "Content-Type": contentType,
                    },
                });
            } catch (error) {
                console.error("Error serving file:", error);
                return new Response("Server Error", { status: 500 });
            }
        },
        "/frontend.js": async () => {
            try {
                // Build the frontend bundle
                const result = await build({
                    entrypoints: ["./src/frontend.tsx"],
                    outdir: "./build",
                    target: "browser",
                    minify: process.env.NODE_ENV === "production",
                });

                // Check for errors
                if (!result.success) {
                    console.error("Build failed:", result.logs);
                    return new Response("Build failed", { status: 500 });
                }

                // Serve the built file
                const file = Bun.file("./build/frontend.js");
                return new Response(await file.arrayBuffer(), {
                    headers: {
                        "Content-Type": "application/javascript",
                    },
                });
            } catch (error) {
                console.error("Error building frontend:", error);
                return new Response("Build error", { status: 500 });
            }
        },

    },
    // Use the fetch handler for dynamic routes (slugs)
    fetch(request) {
        const url = new URL(request.url);
        const path = url.pathname;

        // Skip processing for paths we know are handled by routes
        if (path === "/" || path === "/favicon.ico" || path === "/background.jpg" ||
            path.startsWith("/api/") || path.startsWith("/public/")) {
            // Let the routes handler deal with these
            return new Response("Not Found", { status: 404 });
        }

        // Extract slug from path (remove leading slash)
        const slug = path.substring(1);

        // Only process non-empty slugs
        if (slug) {
            return handleSlugRoute(slug);
        }

        // Default response for any unmatched route
        return new Response("Not Found", { status: 404 });
    }
});

async function handleSlugRoute(slug: string): Promise<Response> {
    try {
        return await renderPost(slug);
    } catch (error) {
        console.error("Error rendering post page:", error);
        return new Response("Not Found", { status: 404 });
    }
}

function getContentType(filePath: string): string {
    const ext = filePath.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'html': return 'text/html';
        case 'css': return 'text/css';
        case 'js': return 'text/javascript';
        case 'json': return 'application/json';
        case 'png': return 'image/png';
        case 'jpg': case 'jpeg': return 'image/jpeg';
        case 'gif': return 'image/gif';
        case 'svg': return 'image/svg+xml';
        case 'pdf': return 'application/pdf';
        default: return 'application/octet-stream';
    }
}

console.log("Server started at http://localhost:3000");
