import React, { useState } from 'react';
import { Modal } from './Modal';

export interface Drawing {
    title: string;
    description: string;
    date: string;
    url: string;
}

interface DrawingsModalProps {
    drawings: Drawing[];
    isOpen: boolean;
    onClose?: () => void;
}

export const DrawingsModal: React.FC<DrawingsModalProps> = ({ drawings, isOpen, onClose }) => {
    // Handle escape and click outside
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
            const modal = document.getElementById('drawings-modal');
            if (modal && !modal.contains(e.target as Node)) onClose && onClose();
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [isOpen, onClose]);
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose || (() => {})}
            style={{ width: '90vw', maxHeight: '85vh', overflow: 'auto' }}
        >
            <div id="drawings-modal" className="flex flex-col h-full">
                <h2 className="text-3xl font-bold mb-6">My Drawings (usually flat color anime girls)</h2>
                <div
                    className="grid gap-6 overflow-y-auto"
                    style={{
                        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                        gridAutoRows: 'min-content'
                    }}
                >
                    {drawings.map((drawing, index) => (
                        <div
                            key={index}
                            className="bg-black/30 rounded-lg overflow-hidden border border-white/10 hover:border-white/30 transition-all h-full flex flex-col"
                        >
                            <div
                                className="relative overflow-hidden"
                                style={{
                                    paddingTop: '75%', /* 4:3 aspect ratio */
                                    position: 'relative'
                                }}
                            >
                                <img
                                    src={drawing.url}
                                    alt={drawing.title}
                                    className="absolute top-0 left-0 hover:scale-105 transition-transform duration-500"
                                    style={{
                                        objectFit: 'contain',
                                        width: '100%',
                                        height: '100%',
                                    }}
                                />
                            </div>
                            <div className="p-4 flex-grow">
                                <h3 className="text-xl font-medium mb-2">{drawing.title}</h3>
                                <p className="text-gray-300 text-sm mb-2">
                                    {drawing.description}
                                </p>
                                <p className="text-gray-400 text-xs">{drawing.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    );
};
