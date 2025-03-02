import React, { useState } from 'react';
import { Modal } from './Modal';
import type { Drawing } from '../lib/types';

interface DrawingsModalProps {
    drawings: Drawing[];
}

export const DrawingsModal: React.FC<DrawingsModalProps> = ({ drawings }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Trigger button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-16 left-1/2 -translate-x-1/2 bg-black/30 hover:bg-black/50
                  text-white/80 hover:text-orange-300 backdrop-blur-md px-5 py-3 rounded-full
                  transition-all duration-300 shadow-lg hover:shadow-orange-300/20
                  flex items-center gap-2 z-10"
            >
                <span className="text-lg font-medium">my drawings</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path
                        fillRule="evenodd"
                        d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {/* Modal */}
            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                style={{
                    width: '90vw',
                    maxHeight: '85vh',
                    overflow: 'auto'
                }}
            >
                <div className="flex flex-col h-full">
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
        </>
    );
};
