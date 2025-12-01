import { Lock, AlertTriangle } from "lucide-react";
import { User } from "@/types/user";
import { useState } from "react";
import { ChangePassword } from "@/features/settings/ChangePassword";
import { Button } from "@/components/ui";
import { useMutation } from "@/hooks/useMutation";
import { userApi } from "@/api/user";
import { useAuth } from "@/context/auth-context";
import { SettingsSection } from "@/components/ui/SettingsSection";
import { OtpSettings } from "./otp";

export const SecuritySettings = ({ user }: { user: User }) => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [confirmDeletion, setConfirmDeletion] = useState(false);
  const { refreshUser } = useAuth();

  const { mutate: deleteAccount, isLoading: isDeleting } = useMutation(
    userApi.deleteAccount,
    {
      onSuccess: () => {
        window.location.href = "/";
      },
      onError: () => {},
    }
  );

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
                onClick={() => setIsChangingPassword(true)}
                className="min-w-48 h-10"
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
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-destructive flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Danger Zone
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              Permanently delete your account and all associated data.
            </p>
          </div>

          {!confirmDeletion ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setConfirmDeletion(true)}
              aria-label="Delete your account"
            >
              Delete Account
            </Button>
          ) : (
            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-2 duration-200">
              <span className="text-sm text-destructive font-medium">
                Are you sure?
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmDeletion(false)}
                disabled={isDeleting}
                aria-label="Cancel account deletion"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteAccount()}
                disabled={isDeleting}
                aria-label="Confirm account deletion"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
