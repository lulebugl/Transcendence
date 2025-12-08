import { Layout } from "@/components/layout/Layout";
import { AchievementsCard } from "./achievements/AchievementsCard";
import { MOCK_MATCHES } from "@/lib/mock-data";
import { MatchHistory } from "./components/MatchHistory";
import { ProfileHeader } from "./components/ProfileHeader";
import { Loading } from "@/components/Loading";
import { StatsGrid } from "./components/StatsGrid";
import { useProfileData } from "./hooks/useProfileData";
import { useParams } from "react-router";
import { ErrorPage } from "@/components/errors/ErrorPage";
import { useAuth } from "@/hooks/useAuth";

export const PlayerProfile = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const {
    profileData,
    isOwnProfile,
    isLoading: isProfileLoading,
    error: errorProfile,
  } = useProfileData(username ? username : undefined);

  if (errorProfile)
    return (
      <ErrorPage>
        <h1 className="text-2xl font-bold text-foreground">Player not found</h1>
        <p className="text-muted-foreground">
          The player you are looking for does not exist.
        </p>
      </ErrorPage>
    );

  if (isProfileLoading) return <Loading />;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-8 md:py-20 space-y-16">
        <ProfileHeader player={profileData} isOwnProfile={isOwnProfile} isLoggedIn={!!user} />
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
