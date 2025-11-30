import { cn } from "@/lib/utils";

type StatusDotProps = {
  status?: "success" | "error" | "warning" | "neutral";
  pulse?: boolean;
  glow?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const statusColors = {
  success: {
    base: "bg-emerald-500",
    glow: "shadow-[0_0_10px_#10b981]",
  },
  error: {
    base: "bg-rose-500",
    glow: "shadow-[0_0_10px_#f43f5e]",
  },
  warning: {
    base: "bg-amber-500",
    glow: "shadow-[0_0_10px_#f59e0b]",
  },
  neutral: {
    base: "bg-muted-foreground",
    glow: "shadow-[0_0_10px_rgba(255,255,255,0.3)]",
  },
} as const;

const sizeClasses = {
  sm: "w-1.5 h-1.5",
  md: "w-2 h-2",
  lg: "w-2.5 h-2.5",
} as const;

/**
 * StatusDot - A small indicator dot with optional pulse and glow effects.
 * Used for status indicators, live badges, match results, etc.
 */
export const StatusDot = ({
  status = "neutral",
  pulse = false,
  glow = true,
  size = "sm",
  className,
}: StatusDotProps) => {
  const colors = statusColors[status];

  return (
    <span
      className={cn(
        "rounded-full inline-block",
        sizeClasses[size],
        colors.base,
        glow && colors.glow,
        pulse && "animate-pulse",
        className
      )}
      aria-hidden="true"
    />
  );
};

/**
 * LiveIndicator - A dot with the animated ping effect for "live" states.
 * Shows a pinging animation behind the dot.
 */
export const LiveIndicator = ({
  size = "md",
  className,
}: Pick<StatusDotProps, "size" | "className">) => {
  return (
    <span className={cn("relative flex", sizeClasses[size], className)}>
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75" />
      <span className={cn("relative inline-flex rounded-full bg-rose-500", sizeClasses[size])} />
    </span>
  );
};

