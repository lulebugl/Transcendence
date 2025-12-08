import { ProfileData, User } from "@/types";
import { cn } from "@/lib/utils";

interface StatsBarProps {
  user: User;
  //   recentMatches: Match[];
}

const RECENT_MATCHES = [
  {
    id: 1,
    opponent: "CyberPong_01",
    result: "WIN",
    score: "11-9",
    date: "2h ago",
    mode: "Ranked",
  },
  {
    id: 2,
    opponent: "GlitchUser",
    result: "LOS",
    score: "8-11",
    date: "5h ago",
    mode: "Tournament",
  },
  {
    id: 3,
    opponent: "AI_Hard",
    result: "WIN",
    score: "11-2",
    date: "1d ago",
    mode: "Practice",
  },
];

const StatContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-background flex flex-col p-8 items-center justify-center gap-2 group hover:bg-white/2 transition-colors cursor-default relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-gradient from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10 flex flex-col items-center">{children}</div>
    </div>
  );
};

export const StatsBar = ({ profileData }: { profileData: ProfileData }) => {
  if (!profileData) return null;

  return (
    <section
      className="grid grid-cols-1 md:grid-cols-3 gap-px bg-linear-to-r from-transparent via-white/5 to-transparent p-px rounded-2xl overflow-hidden animate-fade-in-up"
      style={{ animationDelay: "0.5s" }}
    >
      <StatContainer>
          <div className="text-xs text-muted-foreground uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">
            Progress
          </div>
          <div className="text-3xl font-light tabular-nums">
            {Math.round((profileData.xp / profileData.nextLevelXp) * 100)}%
          </div>
          <div className="w-24 h-0.5 bg-white/10 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-primary w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out" />
          </div>
      </StatContainer>

      <StatContainer>
          <div className="text-xs text-muted-foreground uppercase tracking-widest mb-2 group-hover:text-emerald-400 transition-colors">
            Win Rate
          </div>
          <div className="text-3xl font-light tabular-nums group-hover:scale-110 transition-transform duration-300">
            {profileData.winRate}%
          </div>
		  <div className="w-24 h-0.5 mt-2 overflow-hidden">
          </div>
      </StatContainer>

      <StatContainer>
          <div className="text-xs text-muted-foreground uppercase tracking-widest mb-2 group-hover:text-white transition-colors">
            Latest Result
          </div>
          <div className="text-3xl font-light tabular-nums flex items-center gap-3 group-hover:tracking-widest transition-all duration-300">
            <span
              className={
                RECENT_MATCHES[0].result === "WIN"
                  ? "text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                  : "text-muted-foreground"
              }
            >
              {RECENT_MATCHES[0].result}
            </span>
          </div>
          <span className="text-xs text-muted-foreground font-thin opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0">
            vs {RECENT_MATCHES[0].opponent}
          </span>
      </StatContainer>
    </section>
  );
};
