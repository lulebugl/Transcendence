import { Smartphone, ShieldCheck, ShieldOff } from "lucide-react";
import { Button } from "@/components/ui";

interface OtpStatusCardProps {
  isEnabled: boolean;
  isLoading?: boolean;
  onEnable: () => void;
  onDisable: () => void;
}

export const OtpStatusCard = ({
  isEnabled,
  isLoading,
  onEnable,
  onDisable,
}: OtpStatusCardProps) => {
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
            onClick={onDisable}
            className="text-destructive hover:text-destructive"
            aria-label="Disable two-factor authentication"
          >
            Disable
          </Button>
        ) : (
          <Button
            variant="default"
            size="sm"
            onClick={onEnable}
            disabled={isLoading}
            aria-label="Enable two-factor authentication"
          >
            {isLoading ? "Setting up..." : "Enable"}
          </Button>
        )}
      </div>
    </div>
  );
};
