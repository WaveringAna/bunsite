interface SocialLinkProps {
    href: string;
    label: string;
    children: React.ReactNode;
}

const SocialLink = ({ href, label, children }: SocialLinkProps) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white/80 hover:text-orange-300 transition-colors duration-200"
        aria-label={label}
    >
        {children}
    </a>
);

export const SocialLinks = () => (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 flex flex-col gap-6">
        <SocialLink href="https://github.com/waveringana" label="GitHub">
            <div className="flex items-center gap-3 text-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                <span>GitHub</span>
            </div>
        </SocialLink>
        <SocialLink href="https://twitter.com/waveringana" label="Twitter">
            <div className="flex items-center gap-3 text-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
                <span>Twitter</span>
            </div>
        </SocialLink>
        <SocialLink href="https://bsky.app/profile/nekomimi.pet" label="Bluesky">
            <div className="flex items-center gap-3 text-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.85 6.5c2.08 1.56 4.31 4.73 5.14 6.42.83-1.7 3.06-4.86 5.14-6.42 1.5-1.13 3.93-2 3.93.78 0 .55-.32 4.65-.5 5.32-.65 2.31-3 2.9-5.1 2.54 3.67.62 4.6 2.69 2.58 4.76-3.83 3.92-5.5-.99-5.93-2.24-.08-.23-.12-.34-.12-.25 0-.09-.04.02-.12.25-.43 1.25-2.1 6.16-5.93 2.24-2.02-2.07-1.09-4.14 2.58-4.76-2.1.36-4.45-.23-5.1-2.54-.19-.67-.5-4.77-.5-5.32 0-2.77 2.43-1.9 3.93-.78z" />
                </svg>
                <span>Bluesky</span>
            </div>
        </SocialLink>
    </div>
);
