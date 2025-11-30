export type BadgeColor = keyof typeof colorSchemes;

export const DottedBadge = ({
  children,
  color = "primary",
}: {
  children: React.ReactNode;
  color?: BadgeColor;
}) => {
  const scheme = colorSchemes[color];

  return (
    <>
      <span className="relative inline-flex items-center px-3 py-1 group w-fit">
        {/* Dashed border with glow */}
        <span
          className={`absolute inset-0 border border-dashed ${scheme.border} ${scheme.bg} ${scheme.hoverBg} ${scheme.hoverBorder} transition-colors`}
        />

        {/* Corner decorations */}
        <svg
          className={`absolute -top-[3px] -left-[3px] w-[7px] h-[7px] ${scheme.text}`}
          viewBox="0 0 7 7"
          fill="currentColor"
        >
          <path d="M3 0h1v3h3v1h-3v3h-1v-3h-3v-1h3z" />
        </svg>
        <svg
          className={`absolute -top-[3px] -right-[3px] w-[7px] h-[7px] ${scheme.text}`}
          viewBox="0 0 7 7"
          fill="currentColor"
        >
          <path d="M3 0h1v3h3v1h-3v3h-1v-3h-3v-1h3z" />
        </svg>
        <svg
          className={`absolute -bottom-[3px] -left-[3px] w-[7px] h-[7px] ${scheme.text}`}
          viewBox="0 0 7 7"
          fill="currentColor"
        >
          <path d="M3 0h1v3h3v1h-3v3h-1v-3h-3v-1h3z" />
        </svg>
        <svg
          className={`absolute -bottom-[3px] -right-[3px] w-[7px] h-[7px] ${scheme.text}`}
          viewBox="0 0 7 7"
          fill="currentColor"
        >
          <path d="M3 0h1v3h3v1h-3v3h-1v-3h-3v-1h3z" />
        </svg>

        <span
          className={`relative font-mono text-[11px] font-medium tracking-[0.2em] ${scheme.text} uppercase`}
        >
          {children}
        </span>
      </span>
    </>
  );
};

const colorSchemes = {
  primary: {
    border: "border-primary/40",
    bg: "bg-primary/5",
    text: "text-primary",
    hoverBg: "group-hover:bg-primary/10",
    hoverBorder: "group-hover:border-primary/60",
  },
  cyber: {
    border: "border-cyber/40",
    bg: "bg-cyber/5",
    text: "text-cyber",
    hoverBg: "group-hover:bg-cyber/10",
    hoverBorder: "group-hover:border-cyber/60",
  },
  blue: {
    border: "border-blue-500/40",
    bg: "bg-blue-500/5",
    text: "text-blue-500",
    hoverBg: "group-hover:bg-blue-500/10",
    hoverBorder: "group-hover:border-blue-500/60",
  },
  emerald: {
    border: "border-emerald-500/40",
    bg: "bg-emerald-500/5",
    text: "text-emerald-500",
    hoverBg: "group-hover:bg-emerald-500/10",
    hoverBorder: "group-hover:border-emerald-500/60",
  },
  red: {
    border: "border-red-500/40",
    bg: "bg-red-500/5",
    text: "text-red-500",
    hoverBg: "group-hover:bg-red-500/10",
    hoverBorder: "group-hover:border-red-500/60",
  },
  yellow: {
    border: "border-yellow-500/40",
    bg: "bg-yellow-500/5",
    text: "text-yellow-500",
    hoverBg: "group-hover:bg-yellow-500/10",
    hoverBorder: "group-hover:border-yellow-500/60",
  },
  purple: {
    border: "border-purple-500/40",
    bg: "bg-purple-500/5",
    text: "text-purple-500",
    hoverBg: "group-hover:bg-purple-500/10",
    hoverBorder: "group-hover:border-purple-500/60",
  },
} as const;
