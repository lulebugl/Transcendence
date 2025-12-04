import { friendsApi } from "@/api/friends";
import { Button } from "@/components/ui";
import { UserAvatar } from "@/components/UserAvatar";
import { useMutation } from "@/hooks/useMutation";
import {
  Crown,
  Zap,
  Calendar,
  TrendingUp,
  Swords,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export const MOCK_USER = {
  id: 3,
  username: "CyberPilot_42",
  email: "cyberpilot@transcendence.io",
  avatar_url: "https://api.dicebear.com/9.x/avataaars/svg?seed=tryHarsdfsf",
  level: 42,
  xp: 8500,
  nextLevelXp: 10000,
  rank: "Diamond",
  rankPosition: 127,
  totalPlayers: 4823,
  memberSince: "Jan 2024",
  status: "online" as const,
};

type UserStatus = "online" | "offline" | "away";

const statusConfig: Record<
  UserStatus,
  { label: string; color: string; glow: string }
> = {
  online: {
    label: "Online",
    color: "bg-emerald-400",
    glow: "shadow-[0_0_12px_rgba(52,211,153,0.6)]",
  },
  offline: {
    label: "Offline",
    color: "bg-zinc-500",
    glow: "",
  },
  away: {
    label: "Away",
    color: "bg-amber-400",
    glow: "shadow-[0_0_12px_rgba(251,191,36,0.6)]",
  },
};

interface ProfileHeaderProps {
  user: typeof MOCK_USER;
  isOwnProfile?: boolean;
}

const FriendsButtons = ({ user }: { user: typeof MOCK_USER }) => {
  const { mutate: getFriends } = useMutation(friendsApi.getFriends, {
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to get friends");
    },
  });

  useEffect(() => {
    getFriends();
  }, [getFriends]);

  const { mutate: addFriend } = useMutation(friendsApi.addFriend, {
    onSuccess: () => {
      getFriends();
      toast.success(`Added ${user.username} as friend`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add friend");
    },
  });
  const { mutate: removeFriend } = useMutation(friendsApi.removeFriend, {
    onSuccess: () => {
      toast.success(`Removed ${user.username} as friend`);
      getFriends();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="flex items-center justify-center lg:justify-start gap-3 lg:pt-2 pt-4">
      <Button
        variant="cyber"
        aria-label={`Add ${user.username} as friend`}
        onClick={() => addFriend(user.id)}
      >
        <UserPlus className="w-4 h-4" />
        <span className="text-xs uppercase tracking-widest">Add Friend</span>
      </Button>
      <Button
        variant="cyber"
        className="bg-black/80 text-white hover:bg-black/70 hover:shadow-none before:bg-transparent hover:before:bg-transparent"
        aria-label={`Remove ${user.username} as friend`}
        onClick={() => removeFriend(user.id)}
      >
        <UserPlus className="w-4 h-4" />
        <span className="text-xs uppercase tracking-widest">Remove Friend</span>
      </Button>
    </div>
  );
};

export const ProfileHeader = ({
  user,
  isOwnProfile = false,
}: ProfileHeaderProps) => {
  const xpProgress = (user.xp / user.nextLevelXp) * 100;
  const percentile = ((user.rankPosition / user.totalPlayers) * 100).toFixed(1);
  const status = statusConfig[user.status];

  return (
    <section className="relative">
      {/* Ambient glow - positioned behind everything */}
      <div className="absolute -top-32 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative">
        {/* Top Section: Avatar + Main Info */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center lg:items-end">
          {/* Avatar with decorative frame */}
          <div className="relative shrink-0">
            {/* Outer decorative ring */}
            <div className="absolute -inset-4 border border-dashed border-white/10 rounded-full" />
            <div className="absolute -inset-8 border border-white/5 rounded-full" />

            {/* Avatar container */}
            <div className="relative group cursor-pointer">
              <UserAvatar
                username={user.username}
                avatarUrl={user.avatar_url}
                className="w-36 h-36 lg:w-44 lg:h-44 rounded-full object-cover border-2 border-white/10 transition-all duration-500 group-hover:border-primary/50 group-hover:scale-[1.02]"
              />

              {/* Level badge - positioned on avatar */}
              <div className="absolute -bottom-2 -right-2 flex items-center gap-1.5 px-3 py-1.5 bg-background border border-white/10 rounded-full">
                <Zap className="w-3.5 h-3.5 text-primary" />
                <span className="font-mono text-sm font-bold text-white">
                  {user.level}
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

          {/* User Info */}
          <div className="flex-1 text-center lg:text-left space-y-6 pb-2">
            {/* Username + Rank */}
            {!isOwnProfile && <FriendsButtons user={user} />}
            <div className="space-y-3">
              <div className="flex flex-col lg:flex-row lg:items-baseline gap-3">
                <h1 className="text-4xl lg:text-5xl font-display font-medium tracking-tight text-white">
                  {user.username}
                </h1>
                <div className="flex items-center justify-center lg:justify-start gap-2 text-primary">
                  <Crown className="w-4 h-4" />
                  <span className="font-mono text-sm uppercase tracking-widest">
                    {user.rank}
                  </span>
                </div>
              </div>

              {/* XP Progress - minimal elegant bar */}
              <div className="max-w-sm mx-auto lg:mx-0 space-y-1.5">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-muted-foreground uppercase tracking-wider">
                    Experience
                  </span>
                  <span className="font-mono text-muted-foreground">
                    <span className="text-white">
                      {user.xp.toLocaleString()}
                    </span>
                    <span className="mx-1">/</span>
                    {user.nextLevelXp.toLocaleString()}
                  </span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-primary to-primary/60 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid - architectural style */}
        <div className="mt-10 pt-8 border-t border-white/5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <StatCard
              icon={<TrendingUp className="w-4 h-4" />}
              value={`#${user.rankPosition}`}
              label="Global Rank"
            />
            <StatCard
              icon={<Swords className="w-4 h-4" />}
              value={`Top ${percentile}`}
              label="Percentile"
            />
            <StatCard
              icon={<Zap className="w-4 h-4" />}
              value={user.level.toString()}
              label="Level"
            />
            <StatCard
              icon={<Calendar className="w-4 h-4" />}
              value={user.memberSince}
              label="Member Since"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const StatCard = ({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) => (
  <div className="group relative p-4 lg:p-5 bg-white/2 border border-white/5 rounded-lg hover:border-white/10 hover:bg-white/4 transition-all duration-300">
    {/* Corner accent */}
    <div className="absolute top-0 left-0 w-6 h-px bg-linear-to-r from-primary/50 to-transparent" />
    <div className="absolute top-0 left-0 h-6 w-px bg-linear-to-b from-primary/50 to-transparent" />

    <div className="flex items-start gap-3">
      <div className="text-primary/60 group-hover:text-primary transition-colors">
        {icon}
      </div>
      <div className="space-y-0.5">
        <p className="font-mono text-lg lg:text-xl font-medium text-white tracking-tight">
          {value}
        </p>
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </p>
      </div>
    </div>
  </div>
);
