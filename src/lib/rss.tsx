import { getPosts } from "./posts";
import { v4 as uuidv4 } from 'uuid';

interface RSSItem {
    title: string;
    link: string;
    pubDate: Date;
    description: string;
}

function createRSSHeader(): string {
    return `
<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>nekomimi.pet</title>
        <link>https://nekomimi.pet</link>
        <atom:link href="https://nekomimi.pet/feed.xml" rel="self" type="application/rss+xml" />
        <description>nekomimi.pet</description>
        <copyright>2024 nekomimi.pet CC BY-NC-SA 4.0</copyright>
        <language>en-us</language>
        <pubDate>${new Date().toUTCString()}</pubDate>
        <generator>Bun.sh</generator>
        <docs>https://www.rssboard.org/rss-specification</docs>
        <image>
            <url>https://nekomimi.pet/logo.png</url>
            <title>nekomimi.pet</title>
            <link>https://nekomimi.pet</link>
        </image>`;
}

function createRSSItem(item: RSSItem): string {
    return `
        <item>
            <title>${item.title}</title>
            <link>${item.link}</link>
            <pubDate>${item.pubDate.toUTCString()}</pubDate>
            <description>${item.description}</description>
            <guid isPermaLink="false">${uuidv4()}</guid>
        </item>`;
}

function createRSSFooter(): string {
    return `
    </channel>
</rss>`;
}

export async function generateRSSFeed(): Promise<string> {
    const posts = await getPosts();
    const items: RSSItem[] = posts.map((post) => ({
        title: post.title,
        link: `https://nekomimi.pet/${post.slug}`,
        pubDate: new Date(post.date),
        description: post.excerpt,
    }));

    return [
        createRSSHeader(),
        ...items.map(createRSSItem),
        createRSSFooter()
    ].join('');
}
