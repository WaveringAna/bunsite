// src/components/WritingsPanel.tsx
import React, { useState, useEffect, useRef } from 'react';
import { PostList, type PostCard } from './PostList';

interface WritingsPanelProps {
  posts: PostCard[];
  onPostClick: (post: PostCard) => void;
}

export const WritingsPanel = ({ posts, onPostClick }: WritingsPanelProps) => {
  // Start with "not mounted" to ensure proper initial state
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Mount after initial render
  useEffect(() => {
    setMounted(true);
  }, []);

  const togglePanel = () => {
    setIsOpen(prevState => !prevState);
  };

  // Handle clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && buttonRef.current.contains(event.target as Node)) {
        return;
      }
      
      if (
        isOpen && 
        panelRef.current && 
        !panelRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('.modal-container')
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return (
    <>
      {/* Trigger button */}
      <button 
        ref={buttonRef}
        onClick={togglePanel}
        className={`fixed bottom-16 left-1/2 -translate-x-1/2 bg-black/30 hover:bg-black/50 
                  text-white/80 hover:text-orange-300 backdrop-blur-md px-5 py-3 rounded-full 
                  transition-all duration-300 shadow-lg hover:shadow-orange-300/20 
                  flex items-center gap-2 z-10 ${isOpen ? 'bg-black/50 text-orange-300' : ''}`}
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

      {/* Panel - only render after mounted with guaranteed initial state */}
      {mounted && (
        <div 
          ref={panelRef}
          className="fixed inset-x-0 bottom-0 transform z-20"
          style={{ 
            transition: 'transform 0.5s ease-in-out',
            transform: isOpen ? 'translateY(0)' : 'translateY(100%)'
          }}
          aria-expanded={isOpen}
        >
          <div className="bg-black/40 backdrop-blur-md rounded-t-2xl shadow-lg max-h-[80vh] overflow-y-auto pb-24">
            <div className="flex justify-between items-center p-4 border-b border-white/10 sticky top-0 bg-black/40 backdrop-blur-md z-10">
              <h2 className="text-xl font-medium text-white/90">Writings</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white/90 p-2"
                aria-label="Close panel"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4">
              <PostList posts={posts} onPostClick={(post) => {
                onPostClick(post);
                setIsOpen(false);
              }} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
