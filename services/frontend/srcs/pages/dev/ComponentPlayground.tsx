import { OtpStatusCard } from "@/features/settings/otp/OtpStatusCard";
import { OtpDisableFlow } from "@/features/settings/otp/OtpDisableFlow";
import { OtpSetupFlow } from "@/features/settings/otp/OtpSetupFlow";
import { ChangePassword } from "@/features/settings/ChangePassword";

// Only accessible in development
export const ComponentPlayground = () => {
  if (import.meta.env.PROD) return null;

  return (
    <div className="p-8 space-y-12 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">Component Playground</h1>

      <Section title="Change Password">
        <ChangePassword onCancel={() => console.log("cancel")} />
      </Section>
    </div>
  );
};

// Helper components for the playground
const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-4">
    <h2 className="text-lg font-semibold border-b pb-2">{title}</h2>
    <div className="space-y-6">{children}</div>
  </div>
);

const Variant = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-2">
    <div className="text-xs text-muted-foreground uppercase tracking-wider">
      {label}
    </div>
    <div className="border border-dashed border-border rounded-lg p-4">
      {children}
    </div>
  </div>
);
