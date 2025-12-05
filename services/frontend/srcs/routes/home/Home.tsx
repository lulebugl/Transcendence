import { useAuth } from "@/hooks/useAuth";
import { HeroSection } from "./HeroSection";
import { Layout } from "@/components/layout/Layout";
import { StatsBar } from "./StatsBar";
import { MatchHistory } from "@/routes/profile/MatchHistory";
import { MOCK_MATCHES } from "@/lib/mock-data";

export const Home = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div
        className="max-w-7xl mx-auto px-6 py-12 md:py-20 space-y-24 animate-fade-in"
      >
        <HeroSection user={user} />

        {user ? (
          <>
            <StatsBar user={user} />
            {/* <StatsBar user={user} recentMatches={RECENT_MATCHES} /> */}
			<div className="container mx-auto max-w-3xl">
            	<MatchHistory matches={MOCK_MATCHES} />
            </div>

            {/* <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 animate-fade-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            <MatchHistory matches={MOCK_MATCHES} />
            <FeaturedEvent tournament={featuredTournament} />
          </div> */}
          </>
        ) : (
          <>
            {/* <GuestFeatureCards />
          <GuestLiveCircuit
            featuredTournament={featuredTournament}
            sampleMatches={RECENT_MATCHES.slice(0, 3)}
          /> */}
          </>
        )}
      </div>
    </Layout>
  );
};
