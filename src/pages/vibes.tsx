import "../styles/vibes.css";
import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";

function Vibes() {
    const [vibes, setVibes] = useState<string[]>([]);
    
    useEffect(() => {
        async function fetchVibes() {
            try {
                const response = await fetch('/api/vibes');
                if (!response.ok) {
                    throw new Error('Failed to fetch vibes');
                }
                const data = await response.json();
                setVibes(data);
            } catch (error) {
                console.error('Error fetching vibes:', error);
                setVibes([]);
            }
        }
        
        fetchVibes();
    }, []);
    
    return (
        <div className="vibes-container">
            {vibes.map((vibe, index) => {
                const isVideo = vibe.endsWith('.mp4') || vibe.endsWith('.mov') || vibe.endsWith('.webm');
                
                return isVideo ? (
                    <video 
                        key={index}
                        src={vibe} 
                        className="vibe-item"
                        controls
                        autoPlay={false}
                        loop
                        muted
                    />
                ) : (
                    <img 
                        key={index}
                        src={vibe} 
                        alt=""
                        className="vibe-item"
                        loading="lazy"
                    />
                );
            })}
        </div>
    );
}

document.addEventListener("DOMContentLoaded", () => {
    const rootElement = document.getElementById("root");
    if (!rootElement) throw new Error("Root element not found");
    
    createRoot(rootElement).render(
        <Vibes />
    );
});
