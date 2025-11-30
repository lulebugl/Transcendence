import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  icon?: LucideIcon;
  iconClassName?: string;
}

const Input = ({
  className,
  type,
  icon: Icon,
  iconClassName,
  ...props
}: InputProps) => {
  if (Icon) {
    return (
      <div className="relative group">
        <div
          className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors",
            iconClassName
          )}
        >
          <Icon className="w-4 h-4" />
        </div>
        <input
          type={type}
          data-slot="input"
          className={cn(
            "w-full bg-neutral-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        />
      </div>
    );
  }

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full bg-neutral-900/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
};

export { Input };
