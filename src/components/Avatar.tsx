interface AvatarProps {
    src: string;
    alt: string;
}

export const Avatar = ({ src, alt }: AvatarProps) => (
    <img
        src={src}
        alt={alt}
        className="h-20 w-20 rounded-full"
    />
);
