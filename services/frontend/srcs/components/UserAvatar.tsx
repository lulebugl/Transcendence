import { STATUS_STYLE_CONFIG } from "@/lib/constants/colors";
import { OnlineStatus } from "@/types";
import { useState } from "react";

interface UserAvatarProps {
  username: string;
  avatarUrl?: string;
  className?: string;
  status?: OnlineStatus;
}

export const UserAvatar = ({ username, avatarUrl, className, status }: UserAvatarProps) => {
  const [hasImageError, setHasImageError] = useState(false);
  const firstLetter = username.charAt(0).toUpperCase();
  const showImage = avatarUrl && !hasImageError;
  const currentStatus = STATUS_STYLE_CONFIG[status];

  console.log(status);
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
        <div className={`w-10 h-10 rounded-full bg-transparent flex items-center justify-center text-[oklch(0.1 0 0)] font-bold text-sm shadow group-hover:shadow-lg group-hover:shadow-[oklch(0.85 0.05 85)]/40 transition-all duration-500 border border-[oklch(0.6 0.05 85)] ${className}`}>
          {firstLetter}
        </div>
      )}
      { status && status !== "offline" && <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${currentStatus.color} ${currentStatus.glow} rounded-full border-2 border-background`} /> }
    </div>
  );
};

