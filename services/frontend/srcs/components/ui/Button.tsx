import * as React from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@/lib/Slot";
import { Loader2 } from "lucide-react";

const baseClasses =
  "group inline-flex items-center justify-center whitespace-nowrap text-sm cursor-pointer font-medium transition-all disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-ring/50 focus-visible:ring-2";

const variants = {
  default: "rounded-md text-black hover:text-black min-w-48 h-9 bg-foreground hover:bg-foreground hover:brightness-110",
  primary:
    "rounded-md bg-primary text-primary-foreground hover:brightness-110",
  destructive:
    "rounded-md bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20",
  outline:
    "rounded-md border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
  ghost: "rounded-md hover:bg-accent hover:text-accent-foreground",
  glass:
    "rounded-xl border border-white/10 bg-transparent font-bold tracking-widest uppercase hover:bg-white/10",
  cyber: `relative bg-primary text-primary-foreground font-bold tracking-[0.2em] uppercase overflow-hidden 
    hover:scale-105 hover:shadow-[0_0_40px_-10px_var(--color-primary)] active:scale-95
    before:absolute before:inset-0 before:bg-white/20 before:translate-y-full 
    before:transition-transform before:duration-500 before:pointer-events-none
    hover:before:translate-y-0`,
  underline: `relative bg-transparent font-bold tracking-widest uppercase text-muted-foreground hover:text-foreground
    after:absolute after:bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-px 
    after:bg-current after:transition-all hover:after:w-1/2`,
} as const;

const sizes = {
  default: "h-9 px-4 py-2 gap-2 has-[>svg]:px-3",
  sm: "h-8 px-3 gap-1.5 has-[>svg]:px-2.5 text-xs",
  lg: "px-8 py-4 gap-3 has-[>svg]:px-6",
} as const;

const cyberClipPath =
  "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)";

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

export interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      loading = false,
      asChild = false,
      disabled,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const isCyber = variant === "cyber";

    return (
      <Comp
        ref={ref}
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        style={isCyber ? { ...style, clipPath: cyberClipPath } : style}
        disabled={disabled || loading}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <span className="relative z-10 flex items-center justify-center gap-3">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {children}
          </span>
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";
