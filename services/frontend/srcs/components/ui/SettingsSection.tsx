import * as React from "react";

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const SettingsSection = ({
  title,
  description,
  children,
  className,
}: SettingsSectionProps) => {
  return (
    <div className={className}>
      <div className="pb-6 border-b border-border">
        <h3 className="text-lg font-bold mb-1">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
};

