import { useState, useEffect } from "react";

let MobileSourceUrl = "https://danbooru.donmai.us/posts/9107083?q=exiadoon";
let DesktopSourceUrl = "https://danbooru.donmai.us/posts/6934555?q=exiadoon";

export const BgSource = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <a
            href={isMobile ? MobileSourceUrl : DesktopSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-16 right-6 sm:bottom-10 sm:right-8 text-white/50 hover:text-white/70 
                       text-sm transition-colors backdrop-blur-sm bg-black/20 
                       px-3 py-1.5 rounded-md"
        >
            bg-source
        </a>
    );
};