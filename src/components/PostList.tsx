// Modal Component
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(isOpen);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        if (isOpen) {
            setIsVisible(true);
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            setIsVisible(false);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isVisible) return null;

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center bg-black/40 z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'
                }`}
        >
            <div
                className={`p-8 rounded-md shadow-lg relative max-w-3xl w-full bg-white/20 backdrop-blur-md text-white transition-transform duration-300 overflow-y-auto max-h-[80vh] ${isVisible ? 'translate-y-0' : '-translate-y-full'
                    }`}
                ref={modalRef}
            >
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-300 hover:text-gray-100"
                >
                    Close
                </button>
                {children}
            </div>
        </div>
    );
};

export type PostCard = {
    author: string;
    date: string;
    title: string;
    excerpt: string;
    slug: string;
    content: string; // Added content field
};

export interface PostListProps {
    posts: PostCard[];
}

export const PostList = ({ posts }: PostListProps) => {
    const [selectedPost, setSelectedPost] = useState<PostCard | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (post: PostCard) => {
        setSelectedPost(post);
        setIsModalOpen(true);
        updateUrl(post.slug);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPost(null);
        clearUrl();
    };

    const updateUrl = (slug: string) => {
        history.pushState(null, '', `/${slug}`);
    };

    const clearUrl = () => {
        history.pushState(null, '', '/');
    };

    useEffect(() => {
        const slugFromUrl = window.location.pathname.slice(1); // Remove leading slash
        if (slugFromUrl) {
            const post = posts.find((p) => p.slug === slugFromUrl);
            if (post) {
                openModal(post);
            }
        }
    }, [posts]);

    return (
        <>
            <div className="fixed inset-x-0 top-1/2 -translate-y-1/2 flex justify-center">
                <div className="w-96 flex flex-col gap-4">
                    {posts.map((post, index) => (
                        <div
                            key={index}
                            onClick={() => openModal(post)}
                            className="block bg-black/10 text-white p-4 rounded-md transition duration-300 transform hover:scale-105 hover:bg-black/20 cursor-pointer"
                        >
                            <div className="flex flex-col items-center justify-center">
                                <h2 className="text-2xl font-semibold">{post.title}</h2>
                                <p className="text-gray-200 text-center">{post.excerpt}</p>
                                <p className="text-gray-400 text-sm mt-2">{post.date}</p>
                                <p className="text-gray-400 text-sm mt-2">By {post.author}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                {selectedPost && (
                    <div className="flex flex-col">
                        <h2 className="text-3xl font-bold mb-4">{selectedPost.title}</h2>
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
                                li: ({ node, ...props }) => (
                                    <li className="mb-1" {...props} />
                                ),
                                code: ({ node, ...props }) => (
                                    <code className="bg-gray-700 rounded-md p-1 font-mono" {...props} />
                                ),
                                pre: ({ node, ...props }) => (
                                    <pre className="bg-gray-800 rounded-md p-2 overflow-x-auto">
                                        <code className="text-sm font-mono">{props.children}</code>
                                    </pre>
                                ),
                                blockquote: ({ node, ...props }) => (
                                    <blockquote className="border-l-4 border-gray-500 pl-4 italic text-gray-400" {...props} />
                                ),
                                table: ({ node, ...props }) => (
                                    <table className="table-auto" {...props} />
                                ),
                                th: ({ node, ...props }) => (
                                    <th className="border px-4 py-2" {...props} />
                                ),
                                td: ({ node, ...props }) => (
                                    <td className="border px-4 py-2" {...props} />
                                ),
                                br: ({ node, ...props }) => null, // Remove <br /> elements
                            }}
                        >
                            {selectedPost.content}
                        </ReactMarkdown>
                    </div>
                )}
            </Modal>
        </>
    );
};
