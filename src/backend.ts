import index from "./public/index.html";
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
    },

    development: true,
});

console.log("Server started at http://localhost:3000");
