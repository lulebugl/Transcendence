import { cn } from "@/lib/utils";

interface TabNavigationProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  /** Optional badges */
  badges?: Record<string, number | undefined>;
  className?: string;
}

export const TabNavigation = ({
  tabs,
  activeTab,
  onTabChange,
  badges,
  className,
}: TabNavigationProps) => (
  <div
    className={cn(
      "flex items-center gap-1 p-2 border-b border-white/5 bg-white/2",
      className
    )}
    role="tablist"
  >
    {tabs.map((tab) => {
      const badge = badges?.[tab];
      return (
        <button
          key={tab}
          role="tab"
          aria-selected={activeTab === tab}
          onClick={() => onTabChange(tab)}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium tracking-wide rounded-lg transition-all capitalize",
            activeTab === tab
              ? "bg-white/10 text-white shadow-inner"
              : "text-muted-foreground hover:bg-white/5 hover:text-white/80"
          )}
        >
          {tab}
          {badge !== undefined && badge > 0 && (
            <span
              className={cn(
                "px-1.5 py-0.5 h-4 w-4 flex items-center justify-center rounded-full text-[9px] text-primary-foreground",
                activeTab === tab
                  ? "bg-primary text-primary-foreground"
                  : "bg-white/10 text-primary"
              )}
            >
              {badge}
            </span>
          )}
        </button>
      );
    })}
  </div>
);
