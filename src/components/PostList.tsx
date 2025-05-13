import React from 'react';

export type PostCard = {
  author: string;
  date: string;
  title: string;
  excerpt: string;
  slug: string;
  content: string;
};

export interface PostListProps {
  posts: PostCard[];
  onPostClick: (post: PostCard) => void;
}

export const PostList = ({ posts, onPostClick }: PostListProps) => {
  return (
    <div className="grid gap-4">
      {posts.map((post) => (
        <div
          key={post.slug}
          onClick={() => onPostClick(post)}
          className="bg-black/30 rounded-lg overflow-hidden hover:bg-black/50 transition-all duration-300 cursor-pointer border border-white/10 hover:border-white/30 hover:shadow-lg hover:shadow-orange-300/10"
        >
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-2 text-white">{post.title}</h3>
            <p className="text-gray-300 text-sm mb-2 line-clamp-2">{post.excerpt}</p>
            <div className="flex justify-between text-xs text-gray-400">
              <span>{post.author}</span>
              <span>{post.date}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
