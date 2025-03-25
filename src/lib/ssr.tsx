// src/lib/ssr.ts

import { getPosts } from "./posts.ts";
import { type PostCard } from "../components/PostList.tsx";

async function getIndexHtml() {
    const file = Bun.file("./src/public/ssr.html");
    return await file.text();
}

function createPostMetaTags(post: PostCard): string {
    return `
        <!-- Primary Meta Tags -->
        <title>${post.title} | nekomimi.pet</title>
        <meta name="title" content="${post.title} | nekomimi.pet">
        <meta name="description" content="${post.excerpt}">
        
        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="article">
        <meta property="og:url" content="https://nekomimi.pet/${post.slug}">
        <meta property="og:title" content="${post.title} | nekomimi.pet">
        <meta property="og:description" content="${post.excerpt}">
        <meta property="article:published_time" content="${post.date}">
        <meta property="article:author" content="${post.author}">
        
        <!-- Twitter -->
        <meta property="twitter:card" content="summary_large_image">
        <meta property="twitter:url" content="https://nekomimi.pet/${post.slug}">
        <meta property="twitter:title" content="${post.title} | nekomimi.pet">
        <meta property="twitter:description" content="${post.excerpt}">
    `;
}

function createDefaultMetaTags(): string {
    return `
        <!-- Primary Meta Tags -->
        <title>nekomimi.pet | Ana's Personal Site</title>
        <meta name="title" content="nekomimi.pet | Ana's Personal Site">
        <meta name="description" content="Ana's personal site for writings, drawings, and more">
        
        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="https://nekomimi.pet">
        <meta property="og:title" content="nekomimi.pet | Ana's Personal Site">
        <meta property="og:description" content="Ana's personal site for writings, drawings, and more">
        
        <!-- Twitter -->
        <meta property="twitter:card" content="summary_large_image">
        <meta property="twitter:url" content="https://nekomimi.pet">
        <meta property="twitter:title" content="nekomimi.pet | Ana's Personal Site">
        <meta property="twitter:description" content="Ana's personal site for writings, drawings, and more">
    `;
}

function createResponse(html: string): Response {
    return new Response(html, {
        headers: {
            "Content-Type": "text/html",
        },
    });
}

async function render(slug?: string) {
    const posts = await getPosts();
    const indexHtml = await getIndexHtml();
    
    let metaTags: string;
    
    if (slug) {
        const currentPost = posts.find(post => post.slug === slug);
        metaTags = currentPost ? createPostMetaTags(currentPost) : createDefaultMetaTags();
    } else {
        metaTags = createDefaultMetaTags();
    }
    
    const fullHtml = indexHtml.replace('<title>nekomimi.pet</title>', metaTags);
    return createResponse(fullHtml);
}

export async function renderPost(slug: string) {
    return await render(slug);
}

/*
export async function printRender() {
    const response = await render();
    const text = await response.text();
    console.log(text);
    return text;
}
*/

