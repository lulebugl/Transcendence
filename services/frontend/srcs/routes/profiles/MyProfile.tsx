import { Layout } from "@/components/layout/Layout";
import { AchievementsCard } from "./achievements/AchievementsCard";
import { MOCK_MATCHES } from "@/lib/mock-data";
import { MatchHistory } from "./components/MatchHistory";
import { ProfileHeader } from "./components/ProfileHeader";
import { Loading } from "@/components/Loading";
import { StatsGrid } from "./components/StatsGrid";
import { useProfileData } from "./hooks/useProfileData";

export const UserProfile = () => {
  const {
    profileData,
    isOwnProfile,
    isLoading: isProfileLoading,
    error: errorProfile,
  } = useProfileData();

  if (isProfileLoading) return <Loading />;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-8 md:py-20 space-y-16 animate-fade-in">
        <ProfileHeader player={profileData} isOwnProfile={isOwnProfile} />
        <StatsGrid data={profileData} />

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
