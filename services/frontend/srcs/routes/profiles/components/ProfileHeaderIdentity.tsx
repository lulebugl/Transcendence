import { UserAvatar } from "@/components/UserAvatar";
import { Zap } from "lucide-react";
import { OnlineStatus } from "@/types";
import { STATUS_STYLE_CONFIG } from "@/lib/constants/colors";

interface ProfileHeaderIdentityProps {
  username: string;
  avatarUrl: string;
  level: number;
  status: OnlineStatus;
}

export const ProfileHeaderIdentity = ({
  username,
  avatarUrl,
  level,
  status,
}: ProfileHeaderIdentityProps) => {
  const currentStatus = STATUS_STYLE_CONFIG[status];
  if (!currentStatus) {
    throw new Error(`Invalid status: ${status}`);
  }

  return (
    <div className="relative shrink-0">
      {/* Outer decorative ring */}
      <div className="absolute -inset-4 border border-dashed border-white/10 rounded-full" />
      <div className="absolute -inset-8 border border-white/5 rounded-full" />

      {/* Avatar container */}
      <div className="relative group cursor-pointer">
        <UserAvatar
          username={username}
          avatarUrl={avatarUrl}
          className="w-36 h-36 lg:w-44 lg:h-44 rounded-full object-cover border-2 border-white/10 transition-all duration-500 group-hover:border-primary/50 cursor-none"
        />

        {/* Level badge - positioned on avatar */}
        <div className="absolute -bottom-2 -right-2 flex items-center gap-1.5 px-3 py-1.5 bg-background border border-white/10 rounded-full">
          <Zap className="w-3.5 h-3.5 text-primary" />
          <span className="font-mono text-sm font-bold text-white">
            {level}
          </span>
        </div>

        {/* Status indicator */}
        <div className="absolute top-2 right-2">
          <div
            className={`w-4 h-4 rounded-full ${currentStatus.color} ${currentStatus.glow} border-2 border-background`}
            title={currentStatus.label}
          />
        </div>
      </div>
    </div>
  );
};
