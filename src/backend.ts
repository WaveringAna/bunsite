import index from "./public/index.html";
import drawingsJson from "../content/drawings.json";
import { getPosts } from "./lib/posts";
import { renderPost } from "./lib/ssr";
import { serve, build } from "bun";
import { mkdir } from "node:fs/promises";
import { generateRSSFeed } from "./lib/rss";
console.log("Building frontend for ssr...");
try {
    await mkdir("./build", { recursive: true });
    const result = await build({
        entrypoints: ["./src/frontend.tsx"],
        outdir: "./build",
        target: "browser",
        minify: process.env.NODE_ENV === "production",
    });

    if (!result.success) {
        throw "Build failed:" + result.logs;
    }
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
        "/drawings/:slug": async (request) => {
            try {
                const url = new URL(request.url);
                const pathname = url.pathname.replace("/drawings/", "");
                const drawing = drawingsJson.find((d) => d.slug === pathname);

                if (!drawing) {
                    return new Response("Not Found", { status: 404 });
                }

                const imageUrl = drawing.url.startsWith("http") 
                    ? drawing.url 
                    : `${url.origin}${drawing.url}`;
                
                const title = drawing.title

                const html = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <meta name="description" content="${drawing.description}">
                    
                    <!-- Open Graph / Facebook -->
                    <meta property="og:type" content="image">
                    <meta property="og:title" content="${title}">
                    <meta property="og:description" content="${drawing.description}">
                    <meta property="og:image" content="${imageUrl}">
                    
                    <!-- Twitter -->
                    <meta property="twitter:card" content="summary_large_image">
                    <meta property="twitter:title" content="${title}">
                    <meta property="twitter:description" content="${drawing.description}">
                    <meta property="twitter:image" content="${imageUrl}">
                    
                    <title>${title}</title>
                    <style>
                        body { margin: 0; padding: 20px; display: flex; justify-content: center; background: #f5f5f5; }
                        img { max-width: 100%; max-height: 90vh; object-fit: contain; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
                    </style>
                </head>
                <body>
                    <img src="${drawing.url}" alt="${title}" loading="eager">
                </body>
                </html>
                `;
                return new Response(html, {
                    headers: {
                        "Content-Type": "text/html",
                        "Cache-Control": "no-cache",
                    },
                    status: 200,
                });
            } catch (error) {
                console.error("Error rendering drawing page:", error);
                return new Response("Not Found", { status: 404 });
            }
        },
        "/resume": new Response(await Bun.file("./src/public/resume.pdf").bytes(), {
            headers: {
                "Content-Type": "application/pdf",
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
        "/frontend.js": async () => {
            // Serve the built file
            const file = Bun.file("./build/frontend.js");
            return new Response(await file.arrayBuffer(), {
                headers: {
                    "Content-Type": "application/javascript",
                },
            });
        },
        "/rss.xml": async () => {
            const rss = await generateRSSFeed();
            return new Response(rss, {
                headers: { "Content-Type": "application/rss+xml" },
            });
        }
    },
    // Use the fetch handler for dynamic routes (slugs)
    fetch(request) {
        const url = new URL(request.url);
        const path = url.pathname;

        const slug = path.substring(1);

        if (slug) {
            return handleSlugRoute(slug);
        }

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
