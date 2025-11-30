import { useState } from "react";

interface UserAvatarProps {
  username: string;
  avatarUrl?: string;
  className?: string;
}

export const UserAvatar = ({ username, avatarUrl, className }: UserAvatarProps) => {
  const [hasImageError, setHasImageError] = useState(false);
  const firstLetter = username.charAt(0).toUpperCase();

  const showImage = avatarUrl && !hasImageError;

  return (
    <div className="relative group cursor-pointer">
      {showImage ? (
        <img
          src={avatarUrl}
          alt={`${username}'s avatar`}
          onError={() => setHasImageError(true)}
          className={`w-10 h-10 rounded-full transition-all duration-500 object-cover ${className}`}
        />
      ) : (
        <div className={`w-10 h-10 rounded-full bg-linear-to-br from-primary via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:shadow-primary/25 transition-all duration-500 ${className}`}>
          {firstLetter}
        </div>
      )}
      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500/80 rounded-full border-2 border-background shadow-[0_0_10px_#10b981]" />
    </div>
  );
};

