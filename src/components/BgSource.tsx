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
        <div className="fixed bottom-16 right-6 sm:bottom-10 sm:right-8">
            <div className="relative inline-flex">
                <div className="absolute inset-0 z-0 pointer-events-none backdrop-blur-sm" style={{ filter: 'url(#glass-distortion)' }}></div>
                <a
                    href={isMobile ? MobileSourceUrl : DesktopSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-10 text-white hover:text-white/70 text-sm transition-colors bg-white/1 px-3 py-1.5 rounded-md"
                >
                    bg-source
                </a>
            </div>
        </div>
    );
};