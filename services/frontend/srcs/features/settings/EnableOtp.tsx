import { useState } from "react";
import {
  Smartphone,
  Copy,
  Check,
  ShieldCheck,
  ShieldOff,
  Eye,
  EyeOff,
} from "lucide-react";
import { User } from "@/types";
import { useMutation } from "@/hooks/useMutation";
import { userApi } from "@/api/user";
import { Button } from "@/components/ui";
import { FormInput } from "@/components/forms/FormInput";
import { FormError } from "@/components/forms/FormError";

type Step = "idle" | "setup" | "disable";

interface EnableOtpProps {
  user: User;
  onUpdate?: () => void;
}

export const EnableOtp = ({ user, onUpdate }: EnableOtpProps) => {
  const [step, setStep] = useState<Step>("idle");
  const [setupData, setSetupData] = useState<{
    secret: string;
    otpauth_url: string;
    qr_image: string;
  } | null>(null);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const isEnabled = user.totp_enabled;

  const { mutate: setupOtp, isLoading: isSettingUp } = useMutation(
    userApi.setupOtp,
    {
      onSuccess: (data) => {
        setSetupData(data);
        setStep("setup");
        setError("");
      },
      onError: (err) => setError((err as Error).message),
    }
  );

  const { mutate: confirmOtp, isLoading: isConfirming } = useMutation(
    userApi.confirmOtp,
    {
      onSuccess: () => {
        handleReset();
        onUpdate?.();
      },
      onError: (err) => setError((err as Error).message),
    }
  );

  const { mutate: disableOtp, isLoading: isDisabling } = useMutation(
    userApi.disableOtp,
    {
      onSuccess: () => {
        handleReset();
        onUpdate?.();
      },
      onError: (err) => setError((err as Error).message),
    }
  );

  const handleReset = () => {
    setStep("idle");
    setSetupData(null);
    setCode("");
    setPassword("");
    setError("");
  };

  const handleCopySecret = async () => {
    if (!setupData) return;
    await navigator.clipboard.writeText(setupData.secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupData || code.length !== 6) return;
    confirmOtp({ secret: setupData.secret, code });
  };

  const handleDisable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    disableOtp({ password });
  };

  // Idle state - just show toggle/button
  if (step === "idle") {
    return (
      <div className="pt-6 border-t border-border space-y-4">
        <h4 className="font-medium flex items-center gap-2">
          <Smartphone className="w-4 h-4" /> Two-Factor Authentication
        </h4>
        <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-background/50">
          <div className="flex items-center gap-3">
            {isEnabled ? (
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
            ) : (
              <ShieldOff className="w-5 h-5 text-muted-foreground" />
            )}
            <div>
              <div className="font-medium text-sm">Authenticator App</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {isEnabled
                  ? "Your account is protected with 2FA"
                  : "Add an extra layer of security to your account"}
              </div>
            </div>
          </div>

          {isEnabled ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStep("disable")}
              className="text-destructive hover:text-destructive"
              aria-label="Disable two-factor authentication"
            >
              Disable
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setupOtp()}
              disabled={isSettingUp}
              aria-label="Enable two-factor authentication"
            >
              {isSettingUp ? "Setting up..." : "Enable"}
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Setup flow - show QR code and verification
  if (step === "setup" && setupData) {
    return (
      <div className="pt-6 border-t border-border space-y-4">
        <h4 className="font-medium flex items-center gap-2">
          <Smartphone className="w-4 h-4" /> Set Up Two-Factor Authentication
        </h4>

        <div className="bg-muted/30 border border-border rounded-lg p-6 space-y-6 animate-in slide-in-from-top-2 fade-in duration-200">
          {/* Step 1: QR Code */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs">
                1
              </span>
              Scan this QR code with your authenticator app
            </div>
            <div className="flex justify-center p-4 bg-white rounded-lg w-fit mx-auto">
              <img
                src={setupData.qr_image}
                alt="Scan this QR code with your authenticator app"
                className="w-[200px] h-[200px]"
              />
            </div>
          </div>

          {/* Manual entry */}
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground text-center">
              Or enter this code manually:
            </div>
            <div className="flex items-center justify-center gap-2">
              <code className="px-3 py-2 bg-background border border-border rounded text-sm font-mono tracking-wider">
                {setupData.secret}
              </code>
              <button
                type="button"
                onClick={handleCopySecret}
                className="p-2 hover:bg-muted rounded transition-colors"
                aria-label="Copy secret to clipboard"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          {/* Step 2: Verify */}
          <form onSubmit={handleConfirm} className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs">
                2
              </span>
              Enter the 6-digit code from your app
            </div>

            <div className="flex justify-center">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={code}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setCode(val);
                  setError("");
                }}
                placeholder="000000"
                className="min-w-48 text-center text-2xl tracking-[0.5em] font-mono bg-background border border-border rounded-lg py-3 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                autoComplete="one-time-code"
                aria-label="Enter verification code"
              />
            </div>

            {error && <FormError message={error} />}

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleReset}
                disabled={isConfirming}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                size="sm"
                loading={isConfirming}
                // disabled={code.length !== 6 || isConfirming}
              >
                {isConfirming ? "Verifying..." : "Verify & Enable"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Disable flow - require password
  if (step === "disable") {
    return (
      <div className="pt-6 border-t border-border space-y-4">
        <h4 className="font-medium flex items-center gap-2">
          <Smartphone className="w-4 h-4" /> Disable Two-Factor Authentication
        </h4>

        <div className="bg-muted/30 border border-border rounded-lg p-5 space-y-4 animate-in slide-in-from-top-2 fade-in duration-200">
          <p className="text-sm text-muted-foreground">
            Enter your password to disable two-factor authentication. Your
            account will be less secure.
          </p>

          <form onSubmit={handleDisable} className="space-y-4">
            <div className="space-y-2">
              <FormInput
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter your password"
              />
            </div>

            {error && <FormError message={error} />}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
                {showPassword ? "Hide" : "Show"}
              </button>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  disabled={isDisabling}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  size="sm"
                  disabled={!password.trim() || isDisabling}
                >
                  {isDisabling ? "Disabling..." : "Disable 2FA"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return null;
};
