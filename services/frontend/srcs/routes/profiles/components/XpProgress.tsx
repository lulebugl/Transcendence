interface XpProgressProps {
  xp: number;
  nextLevelXp: number;
}

export const XpProgress = ({ xp, nextLevelXp }: XpProgressProps) => {
  const xpProgress = nextLevelXp > 0 ? Math.round((xp / nextLevelXp) * 100) : 0;

  return (
	<div className="max-w-sm mx-auto lg:mx-0 space-y-1.5">
	<div className="flex items-baseline justify-between text-xs">
	  <span className="text-muted-foreground uppercase tracking-wider">
		Experience
	  </span>
	  <span className="font-mono text-muted-foreground">
		<span className="text-white">
		  {xp.toLocaleString()}
		</span>
		<span className="mx-1">/</span>
		{nextLevelXp.toLocaleString()}
	  </span>
	</div>
	<div className="h-1 bg-white/5 rounded-full overflow-hidden">
	  <div
		className="h-full bg-linear-to-r from-primary to-primary/60 rounded-full transition-all duration-1000 ease-out"
		style={{ width: `${xpProgress}%` }}
	  />
	</div>
  </div>
  );
};
