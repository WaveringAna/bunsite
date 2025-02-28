// src/lib/posts.ts
import { readdir, readFile } from 'fs/promises';
import path from 'path';
import { type PostCard } from '../components/PostList';

export interface Post {
  author: string;
  date: string;
  title: string;
  excerpt: string;
  slug: string;
  content: string;
}

export async function getPosts(): Promise<PostCard[]> {
  const postsDirectory = path.join(process.cwd(), 'content/posts');
  const filenames = await readdir(postsDirectory);
  
  const posts = await Promise.all(
    filenames
      .filter(filename => filename.endsWith('.md'))
      .map(async (filename) => {
        const filePath = path.join(postsDirectory, filename);
        const fileContent = await readFile(filePath, 'utf8');
        
        const frontmatterMatch = fileContent.match(/^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/);
        
        if (!frontmatterMatch) {
          throw new Error(`Invalid frontmatter in ${filename}`);
        }
        
        const [, frontmatterStr, content] = frontmatterMatch;
        const frontmatter: Record<string, string> = {};
        
        frontmatterStr.split('\n').forEach(line => {
          const [key, value] = line.split(':').map(s => s.trim());
          if (key && value) frontmatter[key] = value;
        });
        
        const slug = filename.replace(/\.md$/, '');
        
        return {
          author: frontmatter.author || 'waveringana',
          date: frontmatter.date || new Date().toISOString().split('T')[0],
          title: frontmatter.title || 'Untitled',
          excerpt: frontmatter.excerpt || '',
          slug,
          content: content.trim()
        };
      })
  );
  
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
