/**
 * GameMockCard - A mock card component for the game
 * looks components but don't know where to put it
 */
export const GameMockCard = ({
  selectedMode,
}: {
  selectedMode: "ranked" | "practice";
}) => {
  return (
    <div className="bg-card border border-border rounded-2xl relative overflow-hidden group shadow-sm flex flex-col h-[420px] lg:h-full lg:min-h-[480px]">
      {/* Header overlay */}
      <div className="absolute top-4 left-4 z-20 flex gap-2">
        <div className="bg-background/80 backdrop-blur text-xs font-mono px-3 py-1.5 rounded-md border border-border flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          SYSTEM_READY
        </div>
      </div>

      {/* Mode indicator */}
      <div className="absolute top-4 right-4 z-20">
        <div
          className={`
			text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 rounded-md border backdrop-blur
			${
        selectedMode === "ranked"
          ? "border-primary/30 bg-primary/10 text-primary"
          : "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
      }
		  `}
        >
          {selectedMode === "ranked" ? "Ranked" : "Practice"}
        </div>
      </div>

      {/* 3D Viewport Mock */}
      <div className="flex-1 relative bg-black/50">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-64 h-32 transform transition-transform duration-700 group-hover:scale-105">
            {/* Mock Paddle */}
            <div
              className={`
				absolute bottom-0 left-1/2 -translate-x-[40%] w-24 h-3 rounded-full opacity-80 transition-colors duration-500
				${
          selectedMode === "ranked"
            ? "bg-primary shadow-[0_0_15px_var(--color-primary)]"
            : "bg-emerald-500 shadow-[0_0_15px_#10b981]"
        }
			  `}
            />
            {/* Mock Ball */}
            <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_20px_white] animate-bounce" />
            {/* Floor Reflection */}
            <div
              className={`
				absolute -bottom-12 left-1/2 -translate-x-1/2 w-32 h-20 blur-3xl rounded-full transition-colors duration-500
				${selectedMode === "ranked" ? "bg-primary/20" : "bg-emerald-500/20"}
			  `}
            />
          </div>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-6 left-0 right-0 text-center space-y-1">
          <p className="text-2xl font-bold tracking-tight text-foreground/90">
            {selectedMode === "ranked" ? "Ranked Match" : "Training Mode"}
          </p>
          <p className="text-sm text-muted-foreground font-mono uppercase tracking-widest opacity-70">
            Arena Preview •{" "}
            <span
              className={
                selectedMode === "ranked" ? "text-primary" : "text-emerald-500"
              }
            >
              Ready
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
