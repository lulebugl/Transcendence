import { UserAvatar } from "@/components/UserAvatar";
import { Zap } from "lucide-react";
import { OnlineStatus } from "@/types";

const statusStyleConfig = {
  online: {
    color: "bg-emerald-500",
    glow: "shadow-[0_0_10px_#10b981]",
    label: "Online",
  },
  offline: {
    color: "bg-gray-500",
    glow: "shadow-[0_0_10px_#6b7280]",
    label: "Offline",
  },
  away: {
    color: "bg-yellow-500",
    glow: "shadow-[0_0_10px_#f59e0b]",
    label: "Away",
  },
};

interface ProfileHeaderIdentityProps {
  username: string;
  avatarUrl: string;
  level: number;
  status: OnlineStatus;
}

export const ProfileHeaderIdentity = ({
  ...props
}: ProfileHeaderIdentityProps) => {
  const status = statusStyleConfig[props.status];
  if (!status) {
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
          username={props.username}
          avatarUrl={props.avatarUrl}
          className="w-36 h-36 lg:w-44 lg:h-44 rounded-full object-cover border-2 border-white/10 transition-all duration-500 group-hover:border-primary/50 group-hover:scale-[1.02]"
        />

        {/* Level badge - positioned on avatar */}
        <div className="absolute -bottom-2 -right-2 flex items-center gap-1.5 px-3 py-1.5 bg-background border border-white/10 rounded-full">
          <Zap className="w-3.5 h-3.5 text-primary" />
          <span className="font-mono text-sm font-bold text-white">
            {props.level}
          </span>
        </div>

        {/* Status indicator */}
        <div className="absolute top-2 right-2">
          <div
            className={`w-4 h-4 rounded-full ${status.color} ${status.glow} border-2 border-background`}
            title={status.label}
          />
        </div>
      </div>
    </div>
  );
};
