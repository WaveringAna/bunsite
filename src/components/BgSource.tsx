let SourceUrl = "https://danbooru.donmai.us/posts/7229968";

export const BgSource = () => (
    <a
        href={SourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-10 right-8 text-white/50 hover:text-white/70 
                   text-sm transition-colors backdrop-blur-sm bg-black/20 
                   px-3 py-1.5 rounded-md"
    >
        bg-source
    </a>
);