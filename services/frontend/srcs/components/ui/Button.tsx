/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router";
import { Loader2 } from "lucide-react";

const baseClasses =
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-ring/50 focus-visible:ring-2";

const variantClasses = {
  default: "rounded-md bg-white/90 text-black hover:bg-white/80",
  primary: "rounded-md bg-primary text-primary-foreground hover:bg-primary/90",
  destructive:
    "rounded-md bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20",
  outline:
    "rounded-md border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
  ghost: "rounded-md hover:bg-accent hover:text-accent-foreground",
  cyber:
    "relative bg-primary text-primary-foreground font-bold tracking-[0.2em] uppercase overflow-hidden hover:scale-105 hover:shadow-[0_0_40px_-10px_var(--color-primary)] active:scale-95",
  glass:
    "rounded-xl border border-white/10 bg-transparent font-bold tracking-widest uppercase hover:bg-white/10 transition-all",
  underline:
    "relative bg-transparent font-bold tracking-widest uppercase text-muted-foreground hover:text-foreground",
} as const;

const sizeClasses = {
  default: "h-9 px-4 py-2 gap-2 has-[>svg]:px-3",
  sm: "h-8 px-3 gap-1.5 has-[>svg]:px-2.5 text-xs",
  lg: "px-8 py-4 gap-3 has-[>svg]:px-6",
  xl: "px-10 py-4 gap-3 has-[>svg]:px-8",
  icon: "size-9 p-0",
  "icon-sm": "size-8 p-0",
  "icon-lg": "size-10 p-0",
} as const;

// ============================================================================
// Utilities
// ============================================================================

function getButtonClasses(
  variant: ButtonVariant = "default",
  size: ButtonSize = "default",
  className?: string
): string {
  return cn(baseClasses, variantClasses[variant], sizeClasses[size], className);
}

// angular corners for cyber variant
export const cyberClipPath =
  "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)";

// ============================================================================
// Inner Components
// ============================================================================

const HoverOverlay = () => (
  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 pointer-events-none" />
);

const UnderlineEffect = () => (
  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 w-0 h-px bg-current transition-all group-hover:w-1/2" />
);

// ============================================================================
// Types
// ============================================================================

type ButtonVariant = keyof typeof variantClasses;
type ButtonSize = keyof typeof sizeClasses;

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Adds a slide-up overlay effect on hover (used with cyber variant) */
  hoverOverlay?: boolean;
  /** Shows loading spinner and disables button */
  loading?: boolean;
  className?: string;
};

// ============================================================================
// Shared Render Logic
// ============================================================================

interface ButtonContentProps {
  variant: ButtonVariant;
  showOverlay: boolean;
  isUnderline: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

const ButtonContent = ({ variant, showOverlay, isUnderline, loading, children }: ButtonContentProps) => {
  const isCyber = variant === "cyber";

  return (
    <>
      {showOverlay && <HoverOverlay />}
      <span className="relative flex items-center justify-center gap-3">
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </span>
      {isUnderline && <UnderlineEffect />}
    </>
  );
};

// ============================================================================
// Button Component
// ============================================================================

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & ButtonProps
>(
  (
    {
      className,
      variant = "default",
      size = "default",
      hoverOverlay,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isUnderline = variant === "underline";
    const showOverlay =
      hoverOverlay ?? (variant === "cyber");
    const isCyber = variant === "cyber";

    return (
      <button
        ref={ref}
        className={cn("group", getButtonClasses(variant, size, className))}
        style={isCyber ? { clipPath: cyberClipPath } : undefined}
        disabled={disabled || loading}
        {...props}
      >
        <ButtonContent
          variant={variant}
          showOverlay={showOverlay}
          isUnderline={isUnderline}
          loading={loading}
        >
          {children}
        </ButtonContent>
      </button>
    );
  }
);
Button.displayName = "Button";

const ButtonLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<typeof Link> & ButtonProps
>(
  (
    {
      to,
      variant = "default",
      size = "default",
      hoverOverlay,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isCyber = variant === "cyber";
    const isUnderline = variant === "underline";
    const showOverlay =
      hoverOverlay ?? (variant === "cyber");

    return (
      <Link
        ref={ref}
        to={to}
        className={cn("group", getButtonClasses(variant, size, className))}
        style={isCyber ? { clipPath: cyberClipPath } : undefined}
        {...props}
      >
        <ButtonContent
          variant={variant}
          showOverlay={showOverlay}
          isUnderline={isUnderline}
        >
          {children}
        </ButtonContent>
      </Link>
    );
  }
);
ButtonLink.displayName = "ButtonLink";

export {
  Button,
  ButtonLink,
  variantClasses,
  sizeClasses,
  getButtonClasses,
  type ButtonVariant,
  type ButtonSize,
  type ButtonProps,
};

