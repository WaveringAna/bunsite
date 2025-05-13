// src/components/WritingsPanel.tsx
import React, { useState, useEffect, useRef } from 'react';
import { PostList, type PostCard } from '../PostList';
import { Modal } from './Modal';

interface WritingsPanelProps {
  posts: PostCard[];
  onPostClick: (post: PostCard) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const WritingsPanel = ({ posts, onPostClick, isOpen = true, onClose }: WritingsPanelProps) => {
  // Start with "not mounted" to ensure proper initial state
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose || (() => {})}>
      <div className="flex flex-col h-full">
        <h2 className="text-3xl font-bold mb-6">Writings</h2>
        <div className="overflow-y-auto">
          <PostList
            posts={posts}
            onPostClick={(post) => {
              onPostClick(post);
              onClose && onClose();
            }}
          />
        </div>
      </div>
    </Modal>
  );
};
