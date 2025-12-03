import { cn } from "@/lib/utils";

export const SystemIndicator = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  return (
    <>
      <div
        className={cn(
          "inline-flex items-center gap-3 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm animate-fade-in-up overflow-hidden relative group",
          className
        )}
        style={{ animationDelay: "0.1s" }}
      >
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse" />
        <span className="text-[10px] font-mono text-primary tracking-[0.2em] uppercase">
          {text}
        </span>
      </div>
    </>
  );
};
