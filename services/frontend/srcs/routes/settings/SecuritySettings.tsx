import { Lock } from "lucide-react";
import { useState } from "react";
import { ChangePassword } from "./ChangePassword";
import { Button } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { SettingsSection } from "@/components/ui/SettingsSection";
import { OtpSettings } from "./otp";
import { DeleteAccount } from "./DeleteAccount";

export const SecuritySettings = () => {
  const { user } = useAuth();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const { refreshUser } = useAuth();

  return (
    <>
      <SettingsSection
        title="Account Security"
        description="Manage your account access and security settings."
        className="space-y-6"
      >
        <div className="space-y-6">
          <div className="border-border space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Lock className="w-4 h-4" /> Password
            </h4>
            {!isChangingPassword ? (
              <Button
                variant="outline"
				size="sm"
                onClick={() => setIsChangingPassword(true)}
                className="text-black hover:text-black min-w-48 h-9 bg-secondary-foreground hover:bg-secondary-foreground hover:brightness-110"
              >
                Change Password
              </Button>
            ) : (
              <ChangePassword onCancel={() => setIsChangingPassword(false)} />
            )}
          </div>

          <OtpSettings user={user} onUpdate={refreshUser} />
        </div>
      </SettingsSection>
      <div className="pt-6 border-t border-border">
        <DeleteAccount onDelete={refreshUser} />
      </div>
    </>
  );
};
