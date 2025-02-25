// src/components/WritingsPanel.tsx
import React, { useState } from 'react';
import { PostList, type PostCard } from './PostList';

interface WritingsPanelProps {
  posts: PostCard[];
  onPostClick: (post: PostCard) => void;
}

export const WritingsPanel = ({ posts, onPostClick }: WritingsPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Trigger button */}
      <button 
        onClick={togglePanel}
        className="fixed bottom-16 left-1/2 -translate-x-1/2 bg-black/30 hover:bg-black/50 text-white/80 hover:text-orange-300 
                  backdrop-blur-md px-5 py-3 rounded-full transition-all duration-300 
                  shadow-lg hover:shadow-orange-300/20 flex items-center gap-2 z-10"
      >
        <span className="text-lg font-medium">my writings</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Panel */}
      <div className={`fixed inset-x-0 bottom-0 transition-all duration-500 ease-in-out transform z-20 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="bg-black/40 backdrop-blur-md rounded-t-2xl shadow-lg max-h-[80vh] overflow-y-auto pb-24">
          <div className="flex justify-between items-center p-4 border-b border-white/10">
            <h2 className="text-xl font-medium text-white/90">Writings</h2>
            <button 
              onClick={togglePanel}
              className="text-white/70 hover:text-white/90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-4">
            <PostList posts={posts} onPostClick={onPostClick} />
          </div>
        </div>
      </div>
    </>
  );
};
