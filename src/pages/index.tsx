import { useState, useEffect } from "react";
import { Profile } from "../components/Profile";
import { SocialLinks } from "../components/SocialLinks";
import { WritingsPanel } from "../components/WritingsPanel";
import { PostModal } from "../components/Modal";
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
	  async function loadPosts() {
		try {
		  const response = await fetch('/api/posts');
		  const data = await response.json();
		  setPosts(data);
		  
		  // Check URL for slug on page load
		  const slugFromUrl = window.location.pathname.slice(1);
		  if (slugFromUrl) {
			const post = data.find((p: PostCard) => p.slug === slugFromUrl);
			if (post) {
			  setSelectedPost(post);
			  setIsModalOpen(true);
			}
		  }
		} catch (error) {
		  console.error('Failed to load posts:', error);
		} finally {
		  setLoading(false);
		}
	  }
	  
	  loadPosts();
	}, []);
  
	return (
	  <div className="min-h-screen relative">
		<Profile avatarSrc="/avatar.jpg" username="waveringana" />
		<SocialLinks />
		{loading ? (
		  <div className="fixed bottom-16 left-1/2 -translate-x-1/2 text-white/70 bg-black/30 backdrop-blur-md px-5 py-3 rounded-full">
			Loading writings...
		  </div>
		) : (
		  <WritingsPanel posts={posts} onPostClick={handlePostClick} />
		)}
		<PostModal post={selectedPost} isOpen={isModalOpen} onClose={closeModal} />
		<BgSource />
	  </div>
	);
  }
  