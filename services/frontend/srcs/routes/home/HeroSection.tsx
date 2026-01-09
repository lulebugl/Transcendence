import { Link } from "react-router";
import { BaseUserType } from "@/types/users";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DottedBadge } from "@/components/ui/Badge";
import { SystemIndicator } from "@/components/ui/SystemIndicator";
import { getRankColor } from "@/lib/constants";
import { Rank } from "@/types/players";

interface HeroSectionProps {
  user: BaseUserType;
  rank?: Rank;
  rankPosition?: number;
}

export const HeroSection = ({ user, rank, rankPosition }: HeroSectionProps) => {
  return (
    <section className="mt-4 relative flex flex-col items-center text-center space-y-8">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" />

      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-px h-32 bg-linear-to-b from-transparent to-primary/50" />
      <div className="relative z-10 flex flex-col items-center space-y-8">
        <SystemIndicator
          className="ml-1.5"
          text={user ? "System // Connected" : "System // Live Preview"}
        />

        {user ? (
          <>
            <h1
              className="text-6xl md:text-8xl font-bold tracking-tighter text-balance max-w-4xl bg-linear-to-b from-white to-white/40 bg-clip-text text-transparent pb-4"
              style={{ animationDelay: "0.2s" }}
            >
              Welcome To Transcendence.
            </h1>

            <p
              className="text-lg text-muted-foreground max-w-xl leading-relaxed font-light flex items-center justify-center gap-3"
              style={{ animationDelay: "0.3s" }}
            >
              Your current Rank is
              <DottedBadge color={getRankColor(rank)}>{rank}</DottedBadge>
              <span className="text-muted-foreground/60">•</span>
              <span>Top #{rankPosition}</span>
            </p>

            <div
              className="flex items-center gap-6 pt-4"
              style={{ animationDelay: "0.4s" }}
            >
              <Button asChild variant="cyber" size="lg" className="min-w-52">
                <Link to="/lobby">
                  Play Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button
                asChild
                variant="underline"
                size="lg"
                className="font-bold!"
              >
                <Link to="/leaderboard">Leaderboard</Link>
              </Button>
            </div>
          </>
        ) : (
          <>
            <h1
              className="text-5xl md:text-7xl font-bold tracking-tighter text-balance max-w-4xl bg-linear-to-b from-white to-white/40 bg-clip-text text-transparent pb-4"
              style={{ animationDelay: "0.2s" }}
            >
              Claim your seat in the arena.
            </h1>

            <p
              className="text-lg text-muted-foreground max-w-2xl leading-relaxed font-light"
              style={{ animationDelay: "0.3s" }}
            >
              Challenge other players, unlock achievements, <br />and
              climb the ranks.
            </p>

            <div
              className="flex flex-col sm:flex-row items-center gap-4"
              style={{ animationDelay: "0.4s" }}
            >
              <Button asChild variant="cyber" size="lg" className="font-bold!">
                <Link to="/auth/signup">
                  Register Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
