import { User } from "@/types";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/lib/ui/button";
import { Badge } from "@/lib/ui/Badge";

export const HeroSection = ({ user }: { user: User }) => {
  const rank = "Diamond";
  return (
    <section className="relative flex flex-col items-center text-center space-y-8">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" />

      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-px h-32 bg-linear-to-b from-transparent to-primary/50" />
      <div className="relative z-10 flex flex-col items-center space-y-8">
        <div
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm animate-fade-in-up relative overflow-hidden group"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse" />
          <span className="text-[10px] font-mono text-primary tracking-[0.2em] uppercase">
            {user ? "System // Connected" : "System // Live Preview"}
          </span>
        </div>

        {user ? (
          <>
            <h1
              className="text-6xl md:text-8xl font-bold tracking-tighter text-balance max-w-4xl bg-linear-to-b from-white to-white/40 bg-clip-text text-transparent pb-4 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Welcome To Transcendence.
            </h1>

            <p
              className="text-lg text-muted-foreground max-w-xl leading-relaxed font-light animate-fade-in-up flex items-center justify-center gap-3"
              style={{ animationDelay: "0.3s" }}
            >
				Your current Rank is 
				<Badge color="blue">{rank}</Badge>
              
              <span className="text-muted-foreground/60">•</span>
              <span>Top 5% Global</span>
            </p>

            <div
              className="flex items-center gap-6 pt-4 animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              <ButtonLink
                to="/lobby"
                variant="cyber"
                size="lg"
                className="min-w-[200px] font-bold!"
              >
                Play Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </ButtonLink>

              <ButtonLink
                to="/tournaments"
                variant="underline"
                size="lg"
                className="font-bold!"
              >
                Tournaments
              </ButtonLink>
            </div>
          </>
        ) : (
          <>
            <h1
              className="text-5xl md:text-7xl font-bold tracking-tighter text-balance max-w-4xl bg-linear-to-b from-white to-white/40 bg-clip-text text-transparent pb-4 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Claim your seat in the arena.
            </h1>

            <p
              className="text-lg text-muted-foreground max-w-2xl leading-relaxed font-light animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              Challenge pilots worldwide, unlock cyber-grade cosmetics, and
              climb a living ladder that resets every week.
            </p>

            <div
              className="flex flex-col sm:flex-row items-center gap-4 pt-4 animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              <ButtonLink to="/auth/signup" variant="cyber" size="xl">
                Register Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </ButtonLink>

              <ButtonLink to="/tournaments" variant="underline" size="lg">
                See Live Events
              </ButtonLink>
            </div>

            <div
              className="flex gap-8 text-left text-sm text-muted-foreground animate-fade-in-up"
              style={{ animationDelay: "0.45s" }}
            >
              <div>
                <p className="text-2xl font-light text-white">+420%</p>
                <p className="uppercase tracking-[0.3em] text-[10px] mt-1">
                  Community Growth
                </p>
              </div>
              <div>
                <p className="text-2xl font-light text-white">99.2%</p>
                <p className="uppercase tracking-[0.3em] text-[10px] mt-1">
                  Match Stability
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
