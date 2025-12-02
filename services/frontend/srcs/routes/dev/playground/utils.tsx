// Helper components

import { cn } from "@/lib/utils";

const Section = ({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <section className={cn("space-y-10", className)}>
    <h2 className="text-xl font-semibold border-b border-border pb-3">
      {title}
    </h2>
    <div className="space-y-12">{children}</div>
  </section>
);

const SubSection = ({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("space-y-6", className)}>
    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
      {title}
    </h3>
    <div className="space-y-6">{children}</div>
  </div>
);

const Variant = ({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("space-y-3", className)}>
    <span className="text-xs text-muted-foreground/70">{label}</span>
    <div className="border border-dashed border-border rounded-lg p-6">
      {children}
    </div>
  </div>
);

export { Section, SubSection, Variant };
