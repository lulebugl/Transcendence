import { useState } from "react";
import { Smartphone } from "lucide-react";
import { useMutation } from "@/hooks/useMutation";
import { userApi } from "@/api/user";
import { Button } from "@/components/ui";
import { PasswordInput } from "@/components/forms/PasswordInput";
import { FormError } from "@/components/forms/FormError";

interface OtpDisableFlowProps {
  onComplete: () => void;
  onCancel: () => void;
}

export const OtpDisableFlow = ({
  onComplete,
  onCancel,
}: OtpDisableFlowProps) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { mutate: disableOtp, isLoading } = useMutation(userApi.disableOtp, {
    onSuccess: onComplete,
    onError: (err) => setError(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Password is required");
      return;
    }
    disableOtp({ password });
  };

  return (
    <div className="pt-6 border-t border-border space-y-4">
      <h4 className="font-medium flex items-center gap-2">
        <Smartphone className="w-4 h-4" /> Disable Two-Factor Authentication
      </h4>

      <div className="bg-muted/30 border border-border rounded-lg p-5 space-y-4 animate-in slide-in-from-top-2 fade-in duration-200">
        <p className="text-sm text-muted-foreground">
          Enter your password to disable two-factor authentication. Your account
          will be less secure.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <PasswordInput
            label="Password"
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            placeholder="Enter your password"
          />

          {error && <FormError message={error} />}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              size="sm"
              loading={isLoading}
            >
              Disable 2FA
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
