import { SectionHeader } from "@/components/SectionHeaders";
import { MOCK_MATCHES } from "@/lib/mock-data";
import { Link } from "react-router";

export const MatchHistory = ({ matches }: { matches: typeof MOCK_MATCHES }) => {
  return (
    <section className="space-y-4">
      <SectionHeader
        title="Recent Matches"
        rightType="link"
        linkText="View all matches"
        linkTo="#"
      />
      <div className="space-y-2">
        {matches.map((match, index) => (
          <div
            key={match.id}
            className="glass-panel rounded-xl p-4 md:p-5 flex items-center gap-4 group hover:border-white/10 transition-all animate-fade-in-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {/* Result Indicator */}
            <div
              className={`w-1 h-12 rounded-full ${
                match.result === "WIN"
                  ? "bg-emerald-500 shadow-[0_0_10px_#10b981]"
                  : "bg-red-500/80 shadow-[0_0_10px_#ef4444]"
              }`}
            />

            {/* Opponent */}
            <div className="flex-1 min-w-0 w-full">
              <Link
                to="#"
                className="flex items-center gap-3 cursor-pointer w-fit"
              >
                <img
                  src={match.opponent.avatar}
                  alt={match.opponent.name}
                  className="w-10 h-10 rounded-full border border-white/10 grayscale-25 group-hover:grayscale-0 transition-all"
                />
                <div className="min-w-0">
                  <p className="font-medium truncate group-hover:text-primary transition-colors">
                    {match.opponent.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    {match.opponent.rank}
                  </p>
                </div>
              </Link>
            </div>

            {/* mode badge */}
            <div className="flex justify-center w-24">
              <span
                className={`text-[9px] uppercase tracking-widest px-2 py-1 rounded border ${
                  match.mode === "Tournament"
                    ? "border-yellow-500/30 text-yellow-500/80 bg-yellow-500/5"
                    : match.mode === "Ranked"
                    ? "border-blue-500/30 text-blue-400/80 bg-blue-500/5"
                    : "border-white/10 text-muted-foreground/60"
                }`}
              >
                {match.mode}
              </span>
            </div>

            {/* Score */}
            <div className="text-center px-4">
              <p className="text-xl font-mono font-light tracking-wider">
                <span
                  className={
                    match.result === "WIN"
                      ? "text-emerald-400"
                      : "text-muted-foreground"
                  }
                >
                  {match.myScore}
                </span>
                <span className="text-muted-foreground/40 mx-1">-</span>
                <span
                  className={
                    match.result === "LOSS"
                      ? "text-red-400"
                      : "text-muted-foreground"
                  }
                >
                  {match.opponentScore}
                </span>
              </p>
              <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
                {match.result}
              </p>
            </div>

            {/* Meta */}
            <div className="hidden md:flex flex-col items-end gap-1 text-right min-w-[100px]">
              <span
                className={`text-xs font-mono ${
                  match.xpGained > 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {match.xpGained > 0 ? "+" : ""}
                {match.xpGained} XP
              </span>
              <span className="text-[10px] text-muted-foreground">
                {match.date}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
