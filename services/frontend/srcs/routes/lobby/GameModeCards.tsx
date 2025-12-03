import { DottedBadge } from "@/components/ui/Badge";

type GameMode = "practice" | "ranked" | null;

interface GameModeCardProps {
  mode: GameMode;
  title: string;
  description: string;
  icon: React.ElementType;
  color: "primary" | "emerald";
  features: string[];
  isSelected: boolean;
  className?: string;
  onSelect: () => void;
}

/**
 * GameModeCard - A card component for selecting a game mode
 * for now the scheme are managed here but could be move to a prop
 * to give more flexibility to the caller
 */

export const GameModeCard = ({
  title,
  description,
  icon: Icon,
  color,
  features,
  isSelected,
  className,
  onSelect,
}: GameModeCardProps) => {
  const colorClasses = {
    primary: {
      border: isSelected ? "border-primary/60" : "border-white/5",
      glow: "bg-primary/10",
      icon: "text-primary",
      badge: "primary" as const,
    },
    emerald: {
      border: isSelected ? "border-emerald-500/60" : "border-white/5",
      glow: "bg-emerald-500/10",
      icon: "text-emerald-500",
      badge: "emerald" as const,
    },
  };

  const styles = colorClasses[color];

  return (
    <button
      onClick={onSelect}
      className={`
		  relative group text-left p-8 rounded-2xl border backdrop-blur-sm
		  transition-all duration-300 cursor-pointer
		  hover:bg-white/2 hover:border-white/10
		  ${styles.border}
		  ${isSelected ? "bg-white/5" : "bg-card/30"}
		  ${className}
		`}
    >
      {/* Corner accent when selected */}
      {isSelected && (
        <div
          className={`absolute top-0 right-0 w-24 h-24 ${styles.glow} blur-2xl rounded-full pointer-events-none`}
        />
      )}

      <div
        aria-label={`${title} game mode card`}
        className="relative z-10 space-y-4"
      >
        <div
          aria-label={`${title} game mode icon and title`}
          className="flex items-center gap-4"
        >
          <div
            className={`
			  p-3 rounded-xl border border-white/10 
			  ${isSelected ? styles.glow : "bg-white/5"}
			  transition-colors
			`}
          >
            <Icon className={`w-6 h-6 ${styles.icon}`} />
          </div>
          <div>
            <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
            {isSelected && (
              <DottedBadge color={styles.badge}>Selected</DottedBadge>
            )}
          </div>
        </div>

        <p
          aria-label={description}
          className="text-sm text-muted-foreground leading-relaxed"
        >
          {description}
        </p>

        {/* Features list */}
        <ul role="list" aria-label="Features" className="space-y-2 pt-2">
          {features.map((feature, i) => (
            <li
              key={i}
              role="listitem"
              aria-label={feature}
              className="flex items-center gap-2 text-xs text-muted-foreground"
            >
              <span
                className={`w-1 h-1 rounded-full ${
                  isSelected ? styles.icon : "bg-muted-foreground"
                }`}
              />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Selection ring animation */}
      <div
        className={`
		  absolute inset-0 rounded-2xl border transition-opacity duration-300 pointer-events-none
		  ${isSelected ? `${styles.border} opacity-100` : "opacity-0"}
		`}
      />
    </button>
  );
};
