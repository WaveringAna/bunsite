import { useState, useEffect } from "react";
import { Profile } from "../components/Profile";
import { SocialLinks } from "../components/SocialLinks";
import { WritingsPanel } from "../components/WritingsPanel";
import { PostModal } from "../components/Modal";
import { DrawingsModal, type Drawing } from "../components/DrawingsModal";
import { type PostCard } from "../components/PostList";

const BgSource = () => (
	<a
		href="https://danbooru.donmai.us/posts/7229968"
		target="_blank"
		rel="noopener noreferrer"
		className="fixed bottom-4 right-4 text-white/50 hover:text-white/70 
                   text-sm transition-colors backdrop-blur-sm bg-black/20 
                   px-3 py-1.5 rounded-md"
	>
		bg-source
	</a>
);

export default function Home() {
	const [posts, setPosts] = useState<PostCard[]>([]);
	const [drawings, setDrawings] = useState<Drawing[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedPost, setSelectedPost] = useState<PostCard | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handlePostClick = (post: PostCard) => {
		setSelectedPost(post);
		setIsModalOpen(true);
		updateUrl(post.slug);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		clearUrl();
		// You might want to set selectedPost to null after a short delay to allow for animations
		setTimeout(() => setSelectedPost(null), 300);
	};

	const updateUrl = (slug: string) => {
		history.pushState(null, '', `/${slug}`);
	};

	const clearUrl = () => {
		history.pushState(null, '', '/');
	};

	useEffect(() => {
		async function loadData() {
			try {
				// Load posts
				const postsResponse = await fetch('/api/posts');
				const postsData = await postsResponse.json();
				setPosts(postsData);

				// Load drawings
				const drawingsResponse = await fetch('/api/drawings');
				const drawingsData = await drawingsResponse.json();

				// Sort drawings by date
				drawingsData.sort((a: Drawing, b: Drawing) => {
					return new Date(b.date).getTime() - new Date(a.date).getTime();
				});

				setDrawings(drawingsData);

				// Check URL for slug on page load
				const slugFromUrl = window.location.pathname.slice(1);
				if (slugFromUrl) {
					const post = postsData.find((p: PostCard) => p.slug === slugFromUrl);
					if (post) {
						setSelectedPost(post);
						setIsModalOpen(true);
					}
				}
			} catch (error) {
				console.error('Failed to load data:', error);
			} finally {
				setLoading(false);
			}
		}

		loadData();
	}, []);

	return (
		<div className="min-h-screen relative">
			<Profile avatarSrc="/avatar.jpg" username="waveringana" />
			<SocialLinks />
			{loading ? (
				<div className="fixed bottom-16 left-1/2 -translate-x-1/2 text-white/70 bg-black/30 backdrop-blur-md px-5 py-3 rounded-full">
					Loading content...
				</div>
			) : (
				<>
					<WritingsPanel posts={posts} onPostClick={handlePostClick} />
					<DrawingsModal drawings={drawings} />
				</>
			)}
			<PostModal post={selectedPost} isOpen={isModalOpen} onClose={closeModal} />
			<BgSource />
		</div>
	);
}
