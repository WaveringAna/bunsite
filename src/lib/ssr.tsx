// src/lib/ssr.ts

import { getPosts } from "./posts.ts";
import { renderToString } from "react-dom/server";

import Home from "../pages/index.tsx";

async function renderReact(posts: any[]) {
  const html = renderToString(<Home posts={posts} />);
  return html;
}

async function getIndexHtml() {
  const file = Bun.file("./src/public/ssr.html");
  return await file.text();
}

async function render(slug?: string) {
  const posts = await getPosts();

  let metaTags = "";

  if (slug) {
    const currentPost = posts.find((post) => post.slug === slug);

    if (currentPost) {
      metaTags = `
                <!-- Primary Meta Tags -->
                <title>${currentPost.title} | nekomimi.pet</title>
                <meta name="title" content="${currentPost.title} | nekomimi.pet">
                <meta name="description" content="${currentPost.excerpt}">

                <!-- Open Graph / Facebook -->
                <meta property="og:type" content="article">
                <meta property="og:url" content="https://nekomimi.pet/${currentPost.slug}">
                <meta property="og:title" content="${currentPost.title} | nekomimi.pet">
                <meta property="og:description" content="${currentPost.excerpt}">
                <meta property="article:published_time" content="${currentPost.date}">
                <meta property="article:author" content="${currentPost.author}">

                <!-- Twitter -->
                <meta property="twitter:card" content="summary_large_image">
                <meta property="twitter:url" content="https://nekomimi.pet/${currentPost.slug}">
                <meta property="twitter:title" content="${currentPost.title} | nekomimi.pet">
                <meta property="twitter:description" content="${currentPost.excerpt}">
            `;
    }
  }

  if (!metaTags) {
    metaTags = `
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

  const indexHtml = await getIndexHtml();
  const reactHtml = await renderReact(posts);

  const fullHtml = indexHtml
    .replace("<title>nekomimi.pet</title>", metaTags)
    .replace('<div id="root"></div>', `<div id="root">${reactHtml}</div>`)
    .replace('</body>', `<script>window.__INITIAL_DATA__ = ${JSON.stringify({ posts }).replace(/<\/script>/g, '<\\/script>')}</script></body>`);
    
  return new Response(fullHtml, {
    headers: {
      "Content-Type": "text/html",
    },
  });
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
