import { useAuth } from "@/hooks/useAuth";
import { HeroSection } from "./HeroSection";
import { Layout } from "@/components/layout/Layout";
import { StatsBar } from "./StatsBar";
import { MatchHistorySection } from "@/routes/profiles/components/MatchHistorySection";
import { useProfileData } from "@/hooks/useProfileData";

export const Home = () => {
  const { user } = useAuth();
  const { profileData } = useProfileData(user?.username);
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 space-y-24 animate-fade-in">
        <HeroSection
          user={user}
          rank={profileData?.rank}
          rankPosition={profileData?.rankPosition}
        />

        {user && (
          <>
            <StatsBar profileData={profileData} />
            <div className="container mx-auto max-w-3xl">
              <MatchHistorySection playerId={user.id} count={5} offset={0} />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};
