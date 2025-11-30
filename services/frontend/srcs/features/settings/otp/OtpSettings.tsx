import { useState } from "react";
import { User } from "@/types";
import { OtpStatusCard } from "./OtpStatusCard";
import { OtpSetupFlow } from "./OtpSetupFlow";
import { OtpDisableFlow } from "./OtpDisableFlow";

type Step = "idle" | "setup" | "disable";

interface OtpSettingsProps {
  user: User;
  onUpdate?: () => void;
}

export const OtpSettings = ({ user, onUpdate }: OtpSettingsProps) => {
  const [step, setStep] = useState<Step>("idle");

  const handleComplete = () => {
    setStep("idle");
    onUpdate?.();
  };

  const handleCancel = () => {
    setStep("idle");
  };

  if (step === "setup") {
    return <OtpSetupFlow onComplete={handleComplete} onCancel={handleCancel} />;
  }

  if (step === "disable") {
    return <OtpDisableFlow onComplete={handleComplete} onCancel={handleCancel} />;
  }

  return (
    <OtpStatusCard
      isEnabled={user.totp_enabled ?? false}
      onEnable={() => setStep("setup")}
      onDisable={() => setStep("disable")}
    />
  );
};
