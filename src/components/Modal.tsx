// src/components/Modal.tsx
import React, { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark as dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { SEO } from './SEO';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  // Handle mounting/unmounting
  useEffect(() => {
    if (isOpen && !mounted) {
      setMounted(true);
    } else if (!isOpen && mounted) {
      // Delay unmounting until animation completes
      const timer = setTimeout(() => {
        setMounted(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, mounted]);

  // Handle animation
  useEffect(() => {
    if (mounted) {
      // Ensure DOM has updated before animating
      const animationTimer = setTimeout(() => {
        setAnimateIn(isOpen);
      }, 50); // Small delay to ensure DOM is ready
      return () => clearTimeout(animationTimer);
    }
    return undefined;
  }, [isOpen, mounted]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (mounted) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = ''; // Re-enable scrolling
    };
  }, [mounted, onClose]);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black/60 z-50 
                transition-all duration-300 ease-out
                ${animateIn ? 'opacity-100' : 'opacity-0'}`}
      style={{ perspective: '1000px' }}
    >
      <div
        className={`p-8 rounded-md shadow-lg relative max-w-3xl w-full 
                  bg-white/20 backdrop-blur-md text-white overflow-y-auto max-h-[80vh]
                  transition-all duration-300 ease-out
                  ${animateIn
            ? 'opacity-100 translate-y-0 scale-100 rotate-0'
            : 'opacity-0 -translate-y-8 scale-95 rotate-1'
          }`}
        ref={modalRef}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-gray-100 p-2 
                    transition-all duration-200 hover:rotate-90"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
};

export const PostModal = ({
  post,
  isOpen,
  onClose,
}: {
  post: any;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!post) return null;

  return (
    <>
      {isOpen && (
        <SEO 
          title={post.title}
          description={post.excerpt}
          image={post.featuredImage}
          type="article"
          article={{
            publishedTime: post.date,
            author: post.author,
            tags: post.tags,
          }}
        />
      )}
      
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="flex flex-col">
          <h2 className="text-3xl font-bold mb-4">{post.title}</h2>
          <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
            <span>By {post.author}</span>
            <span>{post.date}</span>
          </div>
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            components={{
              h1: ({ node, ...props }) => (
                <h1 className="text-4xl font-bold mb-4" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-3xl font-semibold mb-3" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-2xl font-semibold mb-2" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="text-gray-300 mb-4" {...props} />
              ),
              a: ({ node, ...props }) => (
                <a className="text-blue-400 hover:text-blue-300" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc list-inside text-gray-300" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="list-decimal list-inside text-gray-300" {...props} />
              ),
              li: ({ node, ...props }) => <li className="mb-1" {...props} />,
              code: ({ node, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || '');
                return match ? (
                  <SyntaxHighlighter
                    style={dark}
                    language={match[1]}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code
                    className="bg-gray-700 rounded-md p-1 font-mono"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              pre: ({ node, ...props }) => <>{props.children}</>,
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="border-l-4 border-gray-500 pl-4 italic text-gray-400 mb-4"
                  {...props}
                />
              ),
              table: ({ node, ...props }) => (
                <table className="table-auto mb-4 w-full" {...props} />
              ),
              th: ({ node, ...props }) => (
                <th className="border px-4 py-2 text-left" {...props} />
              ),
              td: ({ node, ...props }) => (
                <td className="border px-4 py-2" {...props} />
              ),
              br: ({ node, ...props }) => null,
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </Modal>
    </>
  );
};
