import React, { useState } from 'react';
import { Modal } from './Modal';

export interface Bookmark {
    title: string;
    url: string;
    author: string;
    date: string;
    description?: string;
}

function groupByDate(items: Bookmark[]) {
    return items.reduce((acc, item) => {
        (acc[item.date] = acc[item.date] || []).push(item);
        return acc;
    }, {} as Record<string, Bookmark[]>);
}

export const BookmarksModal: React.FC<{ bookmarks: Bookmark[]; isOpen?: boolean; onClose?: () => void }> = ({ bookmarks, isOpen = true, onClose }) => {
    React.useEffect(() => {
        if (!isOpen) return;
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose && onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);
    React.useEffect(() => {
        if (!isOpen) return;
        const handleClick = (e: MouseEvent) => {
            const modal = document.getElementById('bookmarks-modal');
            if (modal && !modal.contains(e.target as Node)) onClose && onClose();
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [isOpen, onClose]);
    if (!isOpen) return null;
    const grouped = groupByDate(bookmarks);
    const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose || (() => {})}
            style={{ width: '90vw', maxWidth: '700px', maxHeight: '85vh', overflow: 'auto' }}
        >
            <div id="bookmarks-modal" className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-2xl font-semibold">Bookmarks</h2>
                </div>
                <p className="text-gray-400 text-sm mb-6">Things I found interesting.</p>
                <div className="flex flex-col gap-5 overflow-y-auto pr-1">
                    {sortedDates.map(date => (
                        <div key={date} className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-300 mb-1.5">
                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M8 2v3M16 2v3M3 9h18M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
                                </svg>
                                <span className="text-sm font-medium">{new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                            <div className="flex flex-col divide-y divide-gray-800 bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800">
                                {grouped[date].map((bm, i) => (
                                    <a 
                                        key={bm.url} 
                                        href={bm.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="p-3.5 hover:bg-gray-800 transition-colors group"
                                    >
                                        <div className="flex flex-col">
                                            <div className="text-base font-medium text-white mb-1 group-hover:text-blue-400 transition-colors">{bm.title}</div>
                                            {bm.description && (
                                                <div className="text-gray-400 text-sm mb-2 line-clamp-2">{bm.description}</div>
                                            )}
                                            <div className="text-gray-500 text-xs flex justify-between items-center">
                                                <span>{bm.author}</span>
                                                <svg className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    );
}; 