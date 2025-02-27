import index from "./public/index.html";
import drawingsJson from "../content/drawings.json";
import { getPosts } from "./lib/posts";
import { serve } from "bun";

serve({
    routes: {
        "/*": index,
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
        "/api/drawings": Response.json(drawingsJson)
    },
});

// Helper function to determine content type based on file extension
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
