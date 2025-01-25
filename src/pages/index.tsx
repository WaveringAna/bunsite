import { Profile } from "../components/Profile";
import { SocialLinks } from "../components/SocialLinks";

const BgSource = () => (
    <a
        href="/background.jpg"
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
    return (
        <div
            className="min-h-screen bg-black bg-[url('/background.jpg')] 
        bg-cover before:absolute before:inset-0 before:bg-black/35 relative"
        >
            <div className="relative z-10">
                <Profile avatarSrc="/avatar.jpg" username="waveringana" />
                <SocialLinks />
                <BgSource />
            </div>
        </div>
    );
}
