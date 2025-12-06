import { colorSchemes, type ColorScheme } from "@/lib/constants/colors";

export type BadgeColor = ColorScheme;

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
          className={`absolute -top-[3px] -left-[3px] w-[6px] h-[6px] ${scheme.text}`}
          viewBox="0 0 6 6"
          fill="currentColor"
        >
          <path d="M3 0h1v3h3v1h-3v3h-1v-3h-3v-1h3z" />
        </svg>
        <svg
          className={`absolute -top-[3px] -right-[3px] w-[6px] h-[6px] ${scheme.text}`}
          viewBox="0 0 6 6"
          fill="currentColor"
        >
          <path d="M3 0h1v3h3v1h-3v3h-1v-3h-3v-1h3z" />
        </svg>
        <svg
          className={`absolute -bottom-[3px] -left-[3px] w-[6px] h-[6px] ${scheme.text}`}
          viewBox="0 0 6 6"
          fill="currentColor"
        >
          <path d="M3 0h1v3h3v1h-3v3h-1v-3h-3v-1h3z" />
        </svg>
        <svg
          className={`absolute -bottom-[3px] -right-[3px] w-[6px] h-[6px] ${scheme.text}`}
          viewBox="0 0 6 6"
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
