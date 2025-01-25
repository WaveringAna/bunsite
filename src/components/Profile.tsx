import { Avatar } from "./Avatar"

interface ProfileProps {
    avatarSrc: string;
    username: string;
}

export const Profile = ({ avatarSrc, username }: ProfileProps) => (
    <div className="fixed left-8 top-8">
        <div className="flex items-center gap-4">
            {/*<Avatar src={avatarSrc} alt={`${username}'s avatar`} />*/}
            <h1 className="text-2xl text-white/80 hover:text-orange-300 transition-colors duration-200">
                {username}
            </h1>
        </div>
    </div>
);
