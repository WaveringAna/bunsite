// src/components/WritingsPanel.tsx
import React, { useState, useEffect } from 'react';
import { PostList, type PostCard } from '../PostList';
import { Modal } from './Modal';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark as dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { SEO } from '../SEO';

interface WritingsPanelProps {
  posts: PostCard[];
  isOpen: boolean; // required so we can differentiate closed vs open
  onClose?: () => void;
}

export const WritingsPanel = ({ posts, isOpen, onClose }: WritingsPanelProps) => {
  const [activePost, setActivePost] = useState<PostCard | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // If URL has a slug, preselect that post
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const slug = window.location.pathname.slice(1);
      if (slug) {
        const match = posts.find(p => p.slug === slug);
        if (match) setActivePost(match);
      }
    }
  }, [posts]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Wait for exit animation to complete before resetting
      const resetTimer = setTimeout(() => {
        setActivePost(null);
        setIsAnimating(false);
      }, 400); // Match Modal's exit animation duration
      return () => clearTimeout(resetTimer);
    }
  }, [isOpen]);

  // Always keep component mounted; Modal handles visibility & exit animation

  const handleSelect = (post: PostCard) => {
    setIsAnimating(true);
    setTimeout(() => {
      setActivePost(post);
      setIsAnimating(false);
    }, 300);
    // Reflect state in URL
    if (typeof window !== 'undefined') {
      history.pushState(null, '', `/${post.slug}`);
    }
  };

  const handleBackToList = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setActivePost(null);
      setIsAnimating(false);
    }, 300);
    if (typeof window !== 'undefined') {
      history.pushState(null, '', '/');
    }
  };

  return (
  <Modal 
    isOpen={isOpen} 
    onClose={() => { onClose && onClose(); if (typeof window !== 'undefined') history.pushState(null, '', '/'); }}
    onBack={handleBackToList}
    showBackButton={!!activePost}
  >
      <div className="flex flex-col h-full">
        {!activePost && (
          <div className={`transition-all duration-300 ease-out ${isAnimating ? 'opacity-0 -translate-x-8' : 'opacity-100 translate-x-0'}`}>
            <h2 className="text-3xl font-bold mb-6">Writings</h2>
            <div className="overflow-y-auto">
              <PostList posts={posts} onPostClick={handleSelect} />
            </div>
          </div>
        )}
        {activePost && (
          <div className={`overflow-y-auto transition-all duration-300 ease-out ${isAnimating ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0'}`}>
            <SEO title={activePost.title} description={activePost.excerpt} type="article" article={{ publishedTime: activePost.date, author: activePost.author }} />
            <h2 className="text-3xl font-bold mb-4">{activePost.title}</h2>
            <div className="flex justify-between items-center text-sm text-gray-400 mb-6">
              <span>By {activePost.author}</span>
              <span>{activePost.date}</span>
            </div>
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={{
                h1: ({ node, ...props }) => <h1 className="text-4xl font-bold mb-4" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-3xl font-semibold mb-3" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-2xl font-semibold mb-2" {...props} />,
                p: ({ node, ...props }) => <p className="text-gray-300 mb-4" {...props} />,
                a: ({ node, ...props }) => <a className="text-blue-400 hover:text-blue-300" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc list-inside text-gray-300 mb-4" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal list-inside text-gray-300 mb-4" {...props} />,
                li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                code: ({ node, className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return match ? (
                    <SyntaxHighlighter style={dark} language={match[1]}>
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className="bg-gray-700 rounded-md p-1 font-mono" {...props}>{children}</code>
                  );
                },
                pre: ({ node, ...props }) => <>{props.children}</>,
                blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-500 pl-4 italic text-gray-400 mb-4" {...props} />,
                table: ({ node, ...props }) => <table className="table-auto mb-4 w-full" {...props} />,
                th: ({ node, ...props }) => <th className="border px-4 py-2 text-left" {...props} />,
                td: ({ node, ...props }) => <td className="border px-4 py-2" {...props} />,
                br: ({ node, ...props }) => null,
              }}
            >
              {activePost.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </Modal>
  );
};
