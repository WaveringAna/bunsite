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
    <div className="flex flex-col gap-4">
      {posts.map((post, index) => (
        <div
          key={index}
          onClick={() => onPostClick(post)}
          className="block bg-black/20 text-white p-4 rounded-md transition duration-300 
                    transform hover:scale-102 hover:bg-black/30 cursor-pointer border border-white/5"
        >
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-300 text-sm mt-1">{post.excerpt}</p>
            <div className="flex justify-between items-center mt-2 text-gray-400 text-xs">
              <span>{post.date}</span>
              <span>By {post.author}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
