import { Crown, Calendar, TrendingUp } from "lucide-react";
import { FriendButton } from "@/components/features/FriendButton";
import { ProfileHeaderIdentity } from "./ProfileHeaderIdentity";
import { ProfileData } from "@/types";

interface ProfileHeaderProps {
  player: ProfileData;
  isOwnProfile: boolean;
}

export const ProfileHeader = ({
  player,
  isOwnProfile = false,
}: ProfileHeaderProps) => {
  const xpProgress = (player.xp / player.nextLevelXp) * 100;

  return (
    <section className="relative">
      {/* Ambient glow - positioned behind everything */}
      <div className="absolute -top-32 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center lg:items-end">
          <ProfileHeaderIdentity
            username={player.username}
            avatarUrl={player.avatarUrl}
            level={player.level}
            status={player.onlineStatus}
          />

          {/* User Info */}
          <div className="flex-1 text-center lg:text-left space-y-6 pb-2">
            {!isOwnProfile && (
              <FriendButton playerId={3} playerName={"John Doe"} />
            )}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-10">
              <div className="flex-1 space-y-3">
                <div className="flex flex-col lg:flex-row lg:items-baseline gap-3">
                  <h1 className="text-4xl lg:text-5xl font-display font-medium tracking-tight text-white">
                    {player.username}
                  </h1>
                  <div className="flex items-center justify-center lg:justify-start gap-2 text-primary">
                    <Crown className="w-4 h-4" />
                    <span className="font-mono text-sm uppercase tracking-widest">
                      {player.rank}
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
                        {player.xp.toLocaleString()}
                      </span>
                      <span className="mx-1">/</span>
                      {player.nextLevelXp.toLocaleString()}
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

              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 lg:gap-4 min-w-[240px] lg:min-w-[220px] relative md:absolute md:right-0 md:top-0">
                <InfoStat
                  icon={<TrendingUp className="w-4 h-4" />}
                  value={`# ${player.rankPosition}`}
                  label="Global Rank"
                />
                <InfoStat
                  icon={<Calendar className="w-4 h-4" />}
                  value={player.memberSince}
                  label="Member Since"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const InfoStat = ({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) => (
  <div className="flex items-center gap-3 rounded-lg px-4 py-3">
    <div className="text-primary/70">{icon}</div>
    <div className="space-y-0.5">
      <p className="font-mono text-lg lg:text-xl font-medium text-white tracking-tight">
        {value}
      </p>
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
    </div>
  </div>
);
