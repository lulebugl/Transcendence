import { Layout } from "@/components/layout/Layout";
import { AchievementsCard } from "./achievements/AchievementsCard";
import { MOCK_MATCHES } from "@/lib/mock-data";
import { MatchHistory } from "./MatchHistory";
import { ProfileHeader } from "./ProfileHeader";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@/hooks/useQuery";
import { UserStatsApi } from "@/api/stats";
import { Loading } from "@/components/Loading";
import { MOCK_USER } from "./mockUser";
import { StatsGrid } from "./StatsGrid";

const useUserGameStats = (id: number) => {
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery(() => UserStatsApi.getUserStats(id));
  console.log(stats);
  return { stats, isLoading, error };
};

export const UserProfile = () => {
  const { user, isLoading } = useAuth();
  const {
    stats,
    isLoading: isLoadingStats,
    error: errorStats,
  } = useUserGameStats(user.id);

  if (isLoading) return <Loading />;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-8 md:py-20 space-y-16 animate-fade-in">
        <ProfileHeader user={MOCK_USER} userStats={stats}/>
        <StatsGrid stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <AchievementsCard maxDisplay={8} showLocked={true} />
          </div>
          <div className="lg:col-span-3">
            <MatchHistory matches={MOCK_MATCHES} />
          </div>
        </div>
      </div>
    </Layout>
  );
};
