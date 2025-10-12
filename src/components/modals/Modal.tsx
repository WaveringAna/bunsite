// src/components/Modal.tsx
import React, { useRef, useEffect, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
  onBack?: () => void;
  showBackButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  style,
  onBack,
  showBackButton = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [animateOut, setAnimateOut] = useState(false); // new state for dedicated exit animation

  // Enter / exit lifecycle & animations
  useEffect(() => {
    // Opening sequence
    if (isOpen) {
      if (!mounted) {
        setMounted(true); // mount first
        setAnimateOut(false); // reset exit state
        setAnimateIn(false); // start from initial
        // allow a tick for DOM paint then trigger enter
        const enterTimer = setTimeout(() => setAnimateIn(true), 50);
        return () => clearTimeout(enterTimer);
      } else {
        // already mounted but toggled open again
        setAnimateOut(false);
        const reEnterTimer = setTimeout(() => setAnimateIn(true), 0);
        return () => clearTimeout(reEnterTimer);
      }
    }

    // Closing sequence
    if (!isOpen && mounted) {
      setAnimateIn(false); // remove enter styles
      setAnimateOut(true); // trigger exit styles
      const unmountTimer = setTimeout(() => {
        setMounted(false);
        setAnimateOut(false);
      }, 400); // match transition duration (400ms)
      return () => clearTimeout(unmountTimer);
    }
  }, [isOpen, mounted]);

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

  // Determine animation class set
  let animationClass = '';
  if (animateIn) {
    animationClass = 'opacity-100 translate-y-0 scale-100';
  } else if (animateOut) {
    animationClass = 'opacity-0';
  } else {
    // pre-enter initial state (before animateIn flips true)
    animationClass = 'opacity-0 translate-y-8 scale-95';
  }

  return (
    <div
      className={
        `fixed inset-0 flex items-center justify-center z-50
        transition-all duration-600 ease-out
      `}
      style={{ perspective: '1000px' }}
    >
      <div
        className={`
          rounded-none md:rounded-3xl shadow-lg relative w-full h-full md:max-w-3xl md:h-[80vh]
          bg-black/10 backdrop-blur-lg text-white overflow-hidden
          inset-shadow-sm inset-shadow-white/15
          transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${animationClass}
        `}
        ref={modalRef}
        style={{
          ...style,
          transitionProperty: 'opacity, transform',
        }}
      >
        {showBackButton && onBack && (
          <button
            onClick={onBack}
            className="absolute bottom-4 left-4 md:bottom-auto md:left-auto md:top-4 md:right-16 text-gray-300 hover:text-gray-100 p-2 z-10
              transition-all duration-200
              rounded-3xl bg-black/20 shadow-lg backdrop-blur-lg text-white overflow-hidden
              shadow-2xl/20 inset-shadow-sm inset-shadow-current/15 px-2 py-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
            </svg>
            <span className="sr-only">Back to list</span>
          </button>
        )}
        <button
          onClick={onClose}
          className="absolute bottom-4 right-4 md:bottom-auto md:top-4 md:right-4 text-gray-300 hover:text-gray-100 p-2 z-10
            transition-all duration-200 hover:rotate-90
            rounded-3xl bg-black/20 shadow-lg backdrop-blur-lg text-white overflow-hidden
    				shadow-2xl/20 inset-shadow-sm inset-shadow-current/15 px-2 py-1"
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
        <div 
          className="p-8 pl-8 pr-0 overflow-y-auto h-full"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255, 255, 255, 0.3) transparent',
          }}
        >
          <div className="pr-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
