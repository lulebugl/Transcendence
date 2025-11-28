import { Mail, Lock, Smartphone, AlertTriangle } from "lucide-react";
import { User as UserType } from "@/types";
import { useState, useEffect } from "react";
import { ChangePassword } from "@/features/settings/ChangePassword";
import { Button } from "@/lib/ui";
import { useMutation } from "@/hooks/useMutation";
import { userApi } from "@/api/user";

export const SecuritySettings = ({ user }: { user: UserType }) => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [confirmDeletion, setConfirmDeletion] = useState(false);
  const { mutate: deleteAccount, isLoading: isDeleting } = useMutation(
    userApi.deleteAccount,
    {
      onSuccess: () => {
        window.location.href = "/";
      },
    }
  );

  const handleDeleteAccount = () => {
    deleteAccount();
  };

  return (
    <>
      <div className="space-y-8">
        <div className="pb-6 border-b border-border">
          <h3 className="text-lg font-bold mb-1">Account Security</h3>
          <p className="text-sm text-muted-foreground">
            Manage your account access and security settings.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  defaultValue={user?.email}
                  className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
              <span className="flex items-center text-xs text-emerald-500 bg-emerald-500/10 px-3 rounded-lg font-medium border border-emerald-500/20">
                Verified
              </span>
            </div>
          </div>

          <div className="pt-6 border-t border-border space-y-4">
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

          <div className="pt-6 border-t border-border space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Smartphone className="w-4 h-4" /> Two-Factor Authentication
            </h4>
            <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-background/50">
              <div>
                <div className="font-medium text-sm">Authenticator App</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Use an app like Google Authenticator to protect your account.
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500/50"></div>
              </label>
            </div>
          </div>
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
                onClick={handleDeleteAccount}
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
