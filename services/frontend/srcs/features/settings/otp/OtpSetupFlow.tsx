// features/settings/otp/OtpSetupFlow.tsx
import { useState, useEffect } from "react";
import { Smartphone } from "lucide-react";
import { useMutation } from "@/hooks/useMutation";
import { userApi } from "@/api/user";
import { Button } from "@/components/ui";
import { OtpCodeInput } from "@/components/forms/OtpInput";
import { CopyButton } from "@/components/ui/CopyButton";
import { FormError } from "@/components/forms/FormError";

interface SetupData {
  secret: string;
  otpauth_url: string;
  qr_image: string;
}

interface OtpSetupFlowProps {
  onComplete: () => void;
  onCancel: () => void;
}

export const OtpSetupFlow = ({ onComplete, onCancel }: OtpSetupFlowProps) => {
  const [setupData, setSetupData] = useState<SetupData | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const { mutate: setupOtp, isLoading: isSettingUp } = useMutation(
    userApi.setupOtp,
    {
      onSuccess: (data) => setSetupData(data),
      onError: (err) => setError((err as Error).message),
    }
  );

  const { mutate: confirmOtp, isLoading: isConfirming } = useMutation(
    userApi.confirmOtp,
    {
      onSuccess: onComplete,
      onError: (err) => setError((err as Error).message),
    }
  );

  useEffect(() => {
    setupOtp();
  }, [setupOtp]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupData || code.length !== 6) {
      setError("Please enter a 6-digit code");
      return;
    }
    confirmOtp({ secret: setupData.secret, code });
  };

  // Loading state while fetching QR code
  if (!setupData) {
    return (
      <div className="pt-6 border-t border-border space-y-4">
        <h4 className="font-medium flex items-center gap-2">
          <Smartphone className="w-4 h-4" /> Set Up Two-Factor Authentication
        </h4>
        <div className="bg-muted/30 border border-border rounded-lg p-8">
          <div className="text-center text-muted-foreground">
            {isSettingUp ? "Setting up..." : error ? error : "Loading..."}
          </div>
          {error && (
            <div className="flex justify-center mt-4">
              <Button variant="outline" size="sm" onClick={onCancel}>
                Go Back
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-6 border-t border-border space-y-4">
      <h4 className="font-medium flex items-center gap-2">
        <Smartphone className="w-4 h-4" /> Set Up Two-Factor Authentication
      </h4>

      <div className="bg-muted/30 border border-border rounded-lg p-6 space-y-6 animate-in slide-in-from-top-2 fade-in duration-200">
        {/* Step 1: QR Code */}
        <div className="space-y-4">
          <StepLabel step={1}>
            Scan this QR code with your authenticator app
          </StepLabel>
          <div className="flex justify-center p-4 bg-white rounded-lg w-fit mx-auto">
            <img
              src={setupData.qr_image}
              alt="Scan this QR code with your authenticator app"
              className="w-[200px] h-[200px]"
            />
          </div>
        </div>

        {/* Manual entry option */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground text-center">
            Or enter this code manually:
          </div>
          <div className="flex items-center justify-center gap-2">
            <code className="px-3 py-2 bg-background border border-border rounded text-sm font-mono tracking-wider">
              {setupData.secret}
            </code>
            <CopyButton text={setupData.secret} />
          </div>
        </div>

        {/* Step 2: Verify */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <StepLabel step={2}>Enter the 6-digit code from your app</StepLabel>

          <div className="flex justify-center">
            <OtpCodeInput
              value={code}
              onChange={(val) => {
                setCode(val);
                setError("");
              }}
              autoSubmit
            />
          </div>

          {error && <FormError message={error} className="w-fit mx-auto" />}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              disabled={isConfirming}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              size="sm"
              loading={isConfirming}
            >
              Verify & Enable
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Small helper for step labels
const StepLabel = ({
  step,
  children,
}: {
  step: number;
  children: React.ReactNode;
}) => (
  <div className="flex items-center gap-2 text-sm font-medium">
    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs">
      {step}
    </span>
    {children}
  </div>
);
