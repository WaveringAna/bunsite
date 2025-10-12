import "../styles/index.css";

import { useState, useEffect } from "react";
import { Profile } from "../components/Profile";
import { SocialLinks } from "../components/SocialLinks";
import { WritingsPanel } from "../components/modals/WritingsPanel";
import { DrawingsModal, type Drawing } from "../components/modals/DrawingsModal";
import { BookmarksModal, type Bookmark } from "../components/modals/BookmarksModal";
import { type PostCard } from "../components/PostList";
import { BgSource } from "../components/BgSource";
import { BlueskyProfile } from "atproto-ui";
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
	const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
	const [activeModal, setActiveModal] = useState<null | 'writings' | 'drawings' | 'bookmarks'>(null);

	// Handle opening and closing modals
	const openWritings = () => setActiveModal('writings');

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

				// If a slug is present either via prop or URL, open writings panel; it will load the post internally
				const slugFromUrl = window.location.pathname.slice(1);
				if ((currentPost || slugFromUrl) && postsData) {
					setActiveModal('writings');
				}
			} catch (error) {
				console.error('Failed to load data:', error);
			} finally {
				setLoading(false);
			}
		}

		loadData();
	}, [initialPosts, initialDrawings, currentPost]);

	const isAnyModalOpen = activeModal !== null;

	return (
		<div className="min-h-screen relative bg-cover bg-center transition-all duration-300 flex justify-center items-center">
			{/* Backdrop blur overlay - separate element for Chrome compatibility */}
			{/*isAnyModalOpen && (
				<div 
					className="fixed inset-0 bg-black/30 backdrop-blur-lg z-10 pointer-events-none"
					style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
				/>
			)*/}
			<svg style={{ display: "none" }}>
				<filter
					id="glass-distortion"
					x="0%"
					y="0%"
					width="100%"
					height="100%"
					filterUnits="objectBoundingBox"
				>
					<feTurbulence
						type="fractalNoise"
						baseFrequency="0.008 0.02"
						numOctaves="1"
						seed="5"
						result="turbulence"
					/>

					<feComponentTransfer in="turbulence" result="mapped">
						<feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
						<feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
						<feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
					</feComponentTransfer>

					<feGaussianBlur in="turbulence" stdDeviation="1" result="softMap" />

					<feSpecularLighting
						in="softMap"
						surfaceScale="5"
						specularConstant="4"
						specularExponent="100"
						lighting-color="white"
						result="specLight"
					>
						<fePointLight x="-200" y="-200" z="300" />
					</feSpecularLighting>

					<feComposite
						in="specLight"
						operator="arithmetic"
						k1="0"
						k2="1"
						k3="1"
						k4="0"
						result="litImage"
					/>

					<feDisplacementMap
						in="SourceGraphic"
						in2="softMap"
						scale="150"
						xChannelSelector="R"
						yChannelSelector="G"
					/>
				</filter>
			</svg>
			<Profile avatarSrc="/public/avatar.jpg" username="waveringana" />
			<SocialLinks />
			{/* Navigation - positioned at bottom with margin */}
			<div className="flex fixed bottom-12 left-0 right-0 justify-center z-20">
				<div className="
						relative flex flex-row gap-0 bg-white/1 shadow-lg
						rounded-3xl text-white overflow-hidden
						inset-shadow-sm inset-shadow-white/15 shadow-2xl/20
			    		px-2 py-1
					">
					<div className="absolute inset-0 z-0 pointer-events-none backdrop-blur-sm" style={{ filter: 'url(#glass-distortion)' }}></div>
					<button
						onClick={openWritings}
						className="relative z-10 px-4 py-2 flex flex-col items-center gap-1 text-white/80 hover:text-orange-300 transition-all duration-200 group"
					>
						<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
							<path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
						</svg>
						<span className="text-xs font-normal">Writings</span>
					</button>
					<button
						onClick={() => setActiveModal('drawings')}
						className="relative z-10 px-4 py-2 flex flex-col items-center gap-1 text-white/80 hover:text-orange-300 transition-all duration-200 group"
					>
						<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
							<path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
							<path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
						</svg>
						<span className="text-xs font-normal">Art</span>
					</button>
					<button
						onClick={() => setActiveModal('bookmarks')}
						className="relative z-10 px-4 py-2 flex flex-col items-center gap-1 text-white/80 hover:text-orange-300 transition-all duration-200 group"
					>
						<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
							<path d="M5 3a2 2 0 00-2 2v12l7-4 7 4V5a2 2 0 00-2-2H5z" />
						</svg>
						<span className="text-xs font-normal">Links</span>
					</button>
				</div>
			</div>
			{loading && (
				<div className="fixed bottom-16 left-1/2 -translate-x-1/2 text-white/70 bg-black/30 backdrop-blur-md px-5 py-3 rounded-full">
					Loading content...
				</div>
			)}
			{/* Modals - keep mounted so animateOut can run */}
			<WritingsPanel posts={posts} isOpen={activeModal === 'writings'} onClose={() => setActiveModal(null)} />
			<DrawingsModal drawings={drawings} isOpen={activeModal === 'drawings'} onClose={() => setActiveModal(null)} />
			<BookmarksModal bookmarks={bookmarks} isOpen={activeModal === 'bookmarks'} onClose={() => setActiveModal(null)} />
			<BgSource />
			{/*<Resume />*/}
		</div>
	);
}
