import "../styles/index.css";

import { useState, useEffect } from "react";
import { Profile } from "../components/Profile";
import { SocialLinks } from "../components/SocialLinks";
import { WritingsPanel } from "../components/modals/WritingsPanel";
import { PostModal } from "../components/modals/Modal";
import { DrawingsModal, type Drawing } from "../components/modals/DrawingsModal";
import { BookmarksModal, type Bookmark } from "../components/modals/BookmarksModal";
import { type PostCard } from "../components/PostList";
import { BgSource } from "../components/BgSource";
//import { Resume } from "../components/Resume";

export default function Home({ posts: initialPosts, drawings: initialDrawings, currentPost }: {
    posts?: PostCard[];
    drawings?: Drawing[];
    currentPost?: string | null;
}) {
    // Check for SSR data in window if we're in the browser
    const ssrData = typeof window !== 'undefined' ? (window as any).__INITIAL_DATA__ : null;
    
    // Initialize state with SSR data, props, or empty arrays
    const [posts, setPosts] = useState<PostCard[]>(
        initialPosts || (ssrData?.posts || [])
    );
    const [drawings, setDrawings] = useState<Drawing[]>(
        initialDrawings || (ssrData?.drawings || [])
    );
	const [loading, setLoading] = useState(true);
	const [selectedPost, setSelectedPost] = useState<PostCard | null>(null);
	const [isPostModalOpen, setIsPostModalOpen] = useState(false);
	const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
	const [activeModal, setActiveModal] = useState<null | 'writings' | 'drawings' | 'bookmarks'>(null);

	const handlePostClick = (post: PostCard) => {
		setSelectedPost(post);
		setIsPostModalOpen(true);
		updateUrl(post.slug);
		// Close writings panel when opening a post
		if (activeModal === 'writings') {
			setActiveModal(null);
		}
	};

	const closePostModal = () => {
		setIsPostModalOpen(false);
		clearUrl();
		setTimeout(() => setSelectedPost(null), 300);
	};

	const updateUrl = (slug: string) => {
		history.pushState(null, '', `/${slug}`);
	};

	const clearUrl = () => {
		history.pushState(null, '', '/');
	};

	// Handle opening and closing modals
	const openWritings = () => {
		// Close post modal if it's open when opening writings panel
		if (isPostModalOpen) {
			setIsPostModalOpen(false);
			clearUrl();
			// Small delay to avoid animation conflicts
			setTimeout(() => {
				setSelectedPost(null);
				setActiveModal('writings');
			}, 300);
		} else {
			setActiveModal('writings');
		}
	};

	useEffect(() => {
		async function loadData() {
			try {
				let postsData = initialPosts;
				if (!postsData) {
					const postsResponse = await fetch('/api/posts');
					postsData = await postsResponse.json();
					setPosts(postsData || []);
				}

				let drawingsData = initialDrawings || [];
				if (!drawingsData.length) {
					const drawingsResponse = await fetch('/api/drawings');
					drawingsData = await drawingsResponse.json();
				}
				drawingsData.sort((a: Drawing, b: Drawing) => new Date(b.date).getTime() - new Date(a.date).getTime());
				setDrawings(drawingsData);

				const bookmarksResponse = await fetch('/api/bookmarks');
				const bookmarksData = await bookmarksResponse.json();
				setBookmarks(bookmarksData || []);

				if (currentPost && postsData) {
					const post = postsData.find((p: PostCard) => p.slug === currentPost);
					if (post) {
						setSelectedPost(post);
						setIsPostModalOpen(true);
					}
				} else {
					const slugFromUrl = window.location.pathname.slice(1);
					if (slugFromUrl && postsData) {
						const post = postsData.find((p: PostCard) => p.slug === slugFromUrl);
						if (post) {
							setSelectedPost(post);
							setIsPostModalOpen(true);
						}
					}
				}
			} catch (error) {
				console.error('Failed to load data:', error);
			} finally {
				setLoading(false);
			}
		}

		loadData();
	}, [initialPosts, initialDrawings, currentPost]);

	// Modal open state
	const isAnyModalOpen = activeModal !== null || isPostModalOpen;

	return (
		<div className="min-h-screen relative bg-cover bg-center transition-all duration-300 flex justify-center items-center">
			{/* Backdrop blur overlay - separate element for Chrome compatibility */}
			{isAnyModalOpen && (
				<div 
					className="fixed inset-0 bg-black/30 backdrop-blur-lg z-10 pointer-events-none"
					style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
				/>
			)}
			<Profile avatarSrc="/public/avatar.jpg" username="waveringana" />
			<SocialLinks />
			{/* Desktop navigation - hidden on mobile, positioned at bottom with margin */}
			<div className="hidden md:flex fixed bottom-48 left-0 right-0 justify-center z-20">
				<div className="flex flex-row gap-6">
					<button 
						onClick={openWritings}
						className="flex items-center gap-2.5 text-white/80 hover:text-orange-300 transition-all duration-200 group"
					>
						<div className="w-9 h-9 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-full border border-white/10 shadow-md group-hover:shadow-orange-500/20">
							<svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
								<path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
							</svg>
						</div>
						<span className="text-base font-medium">Writings</span>
					</button>
					<button 
						onClick={() => setActiveModal('drawings')}
						className="flex items-center gap-2.5 text-white/80 hover:text-orange-300 transition-all duration-200 group"
					>
						<div className="w-9 h-9 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-full border border-white/10 shadow-md group-hover:shadow-orange-500/20">
							<svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
								<path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
								<path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
							</svg>
						</div>
						<span className="text-base font-medium">Drawings</span>
					</button>
					<button 
						onClick={() => setActiveModal('bookmarks')}
						className="flex items-center gap-2.5 text-white/80 hover:text-orange-300 transition-all duration-200 group"
					>
						<div className="w-9 h-9 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-full border border-white/10 shadow-md group-hover:shadow-orange-500/20">
							<svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
								<path d="M5 3a2 2 0 00-2 2v12l7-4 7 4V5a2 2 0 00-2-2H5z" />
							</svg>
						</div>
						<span className="text-base font-medium">Bookmarks</span>
					</button>
				</div>
			</div>
			
			{/* Mobile navigation bar - visible only on mobile */}
			<div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/60 backdrop-blur-xl border-t border-white/10 flex justify-around items-center p-2 z-20">
				<button 
					onClick={openWritings} 
					className="flex flex-col items-center justify-center p-2 text-white/80 hover:text-orange-300 transition-colors"
				>
					<svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
						<path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
					</svg>
					<span className="text-xs">Writings</span>
				</button>
				<button 
					onClick={() => setActiveModal('drawings')} 
					className="flex flex-col items-center justify-center p-2 text-white/80 hover:text-orange-300 transition-colors"
				>
					<svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
						<path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
						<path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
					</svg>
					<span className="text-xs">Drawings</span>
				</button>
				<button 
					onClick={() => setActiveModal('bookmarks')} 
					className="flex flex-col items-center justify-center p-2 text-white/80 hover:text-orange-300 transition-colors"
				>
					<svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
						<path d="M5 3a2 2 0 00-2 2v12l7-4 7 4V5a2 2 0 00-2-2H5z" />
					</svg>
					<span className="text-xs">Bookmarks</span>
				</button>
			</div>
			{loading && (
				<div className="fixed bottom-16 left-1/2 -translate-x-1/2 text-white/70 bg-black/30 backdrop-blur-md px-5 py-3 rounded-full">
					Loading content...
				</div>
			)}
			{/* Modals */}
			{activeModal === 'writings' && (
				<WritingsPanel posts={posts} onPostClick={handlePostClick} isOpen={true} onClose={() => setActiveModal(null)} />
			)}
			{activeModal === 'drawings' && (
				<DrawingsModal drawings={drawings} isOpen={true} onClose={() => setActiveModal(null)} />
			)}
			{activeModal === 'bookmarks' && (
				<BookmarksModal bookmarks={bookmarks} isOpen={true} onClose={() => setActiveModal(null)} />
			)}
			<PostModal post={selectedPost} isOpen={isPostModalOpen} onClose={closePostModal} />
			<BgSource />
			{/*<Resume />*/}
		</div>
	);
}
