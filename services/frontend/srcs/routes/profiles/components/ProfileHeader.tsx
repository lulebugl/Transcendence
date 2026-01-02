import { Crown, Calendar, TrendingUp } from "lucide-react";
import { FriendButton } from "@/components/features/FriendButton";
import { ProfileHeaderIdentity } from "./ProfileHeaderIdentity";
import { ProfileData } from "@/types";
import { XpProgressSection } from "./XpProgressSection";

interface ProfileHeaderProps {
  player: ProfileData;
  isOwnProfile: boolean;
  isLoggedIn: boolean;
}

export const ProfileHeader = ({
  player,
  isOwnProfile = false,
  isLoggedIn = false,
}: ProfileHeaderProps) => {
  return (
    <section className="relative">
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

          <div className="flex-1 text-center lg:text-left space-y-6 pb-2">
            {/* actions buttons: only friends for now */}
            {!isOwnProfile && isLoggedIn && (
              <FriendButton playerId={player.id} playerName={player.username} />
            )}

            {/* profile name, rank, xp progress */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-10">
              <div className="flex-1 space-y-3">
                <ProfileNameAndRank
                  username={player.username}
                  rank={player.rank}
                />
                <XpProgressSection
                  xp={player.xp}
                  nextLevelXp={player.nextLevelXp}
                />
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

const ProfileNameAndRank = ({
  username,
  rank,
}: {
  username: string;
  rank: string;
}) => (
  <div className="flex flex-col lg:flex-row lg:items-baseline gap-3">
    <h1 className="text-4xl lg:text-5xl font-display font-medium tracking-tight text-white">
      {username}
    </h1>
    <div className="flex items-center justify-center lg:justify-start gap-2 text-primary">
      <Crown className="w-4 h-4" />
      <span className="font-mono text-sm uppercase tracking-widest">
        {rank}
      </span>
    </div>
  </div>
);

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
