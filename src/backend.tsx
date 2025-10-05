import index from "./public/index.html";
import vibes from "./public/vibes.html";


import drawingsJson from "../content/drawings.json";
import { getPosts } from "./lib/posts";
import { renderPost } from "./lib/ssr";
import { serve, build, ShellError } from "bun";
import { mkdir } from "node:fs/promises";
import { generateRSSFeed } from "./lib/rss";
import { renderToReadableStream } from "react-dom/server";
import { DrawingPage } from "./pages/drawing";
import { $ } from "bun";
import { getVibes } from "./lib/getVibes";

console.log("Building frontend for ssr and tailwind css...");
try {
    await mkdir("./build", { recursive: true });
    const frontendResult = await build({
        entrypoints: ["./src/frontend.tsx"],
        outdir: "./build",
        target: "browser",
        minify: process.env.NODE_ENV === "production",
    });

    if (!frontendResult.success) {
        throw "Build failed:" + frontendResult.logs;
    }
    
    try {
       await $`bun run tailwindcss -i ./src/styles/index.css -o ./src/public/output.css --minify`.text();
    } catch (err: any) {
        const error = err as ShellError;
        
        console.log(error.stdout.toString());
        console.log(error.stderr.toString());
    }
} catch (error) {
    console.error("Error creating build directory:", error);
}

serve({
    port: 3000,
    routes: {
        "/": index,
        "/vibes": vibes,
        "/api/vibes": () => {
            try {
                const vibeFiles = getVibes();
                return Response.json(vibeFiles);
            } catch (error) {
                console.error('Error fetching vibes:', error);
                return new Response(JSON.stringify({ error: 'Failed to fetch vibes' }), {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            }
        },
        "/.well-known/atproto-did": new Response("did:plc:ttdrpj45ibqunmfhdsb4zdwq", {
            headers: { "Content-Type": "text/plain" }
        }),
        "/favicon.ico": new Response(await Bun.file("./src/public/avatar.jpg").arrayBuffer(), {
            headers: {
                "Content-Type": "image/x-icon",
            },
        }),
        "/background.jpg": new Response(await Bun.file("./src/public/background.jpg").arrayBuffer(), {
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

                const stream = await renderToReadableStream(
                    <DrawingPage
                        title={drawing.title}
                        description={drawing.description}
                        imageUrl={imageUrl}
                        url={drawing.url}
                    />
                );

                return new Response(stream, {
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
        "/resume": new Response(await Bun.file("./src/public/resume.pdf").arrayBuffer(), {
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
        },
        "/api/bookmarks": async () => {
            const file = Bun.file("./content/bookmarks.json");
            const exists = await file.exists();
            if (!exists) {
                return new Response(JSON.stringify({ error: 'Bookmarks not found' }), {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                });
            }
            const data = await file.text();
            return new Response(data, {
                headers: { "Content-Type": "application/json" },
            });
        },
    },
    development: process.env.NODE_ENV !== "production",
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
