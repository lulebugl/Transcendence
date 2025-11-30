import { Mail, Lock, Smartphone, AlertTriangle } from "lucide-react";
import { User as UserType } from "@/types";
import { useState, useEffect } from "react";
import { ChangePassword } from "@/features/settings/ChangePassword";
import { Button } from "@/lib/ui";
import { useMutation } from "@/hooks/useMutation";
import { userApi } from "@/api/user";
import { EnableOtp } from "./EnableOtp";
import { useAuth } from "@/context/auth-context";
import { ProfileSettings } from "./ProfileSettings";

export const SecuritySettings = ({ user }: { user: UserType }) => {
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
      <div className="space-y-6">
        <div className="pb-6 border-b border-border">
          <h3 className="text-lg font-bold mb-1">Account Security</h3>
          <p className="text-sm text-muted-foreground">
            Manage your account access and security settings.
          </p>
        </div>

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
              <ChangePassword onCancel={setIsChangingPassword} />
            )}
          </div>

          <EnableOtp user={user} onUpdate={refreshUser} />
        </div>
      </div>
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
