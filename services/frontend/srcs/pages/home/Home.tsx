import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { TOURNAMENTS, RECENT_MATCHES } from "@/lib/mock-data";
import { HeroSection } from "./HeroSection";
import { Layout } from "@/components/layout/layout";
// import { StatsBar } from "./StatsBar";
// import { MatchHistory } from "./MatchHistory";
// import { FeaturedEvent } from "./FeaturedEvent";
// import { GuestFeatureCards } from "./GuestFeatureCards";
// import { GuestLiveCircuit } from "./GuestLiveCircuit";

export const Home = () => {
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();
  //   const featuredTournament = TOURNAMENTS.find((t) => t.status === "Live");

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Layout>
      <div
        className={`max-w-7xl mx-auto px-6 py-12 md:py-20 space-y-24 transition-opacity duration-800 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      >
        <HeroSection user={user} />
		
        {/* {user ? (
        <>
          <StatsBar user={user} recentMatches={RECENT_MATCHES} />
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 animate-fade-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            <MatchHistory matches={RECENT_MATCHES} />
            <FeaturedEvent tournament={featuredTournament} />
          </div>
        </>
      ) : (
        <>
          <GuestFeatureCards />
          <GuestLiveCircuit
            featuredTournament={featuredTournament}
            sampleMatches={RECENT_MATCHES.slice(0, 3)}
          />
        </>
      )} */}
      </div>
    </Layout>
  );
};
