import index from "./public/index.html";
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
    },

    development: true,
});

console.log("Server started at http://localhost:3000");
