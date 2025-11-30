import { useState } from "react";
import { useMutation } from "@/hooks/useMutation";
import { userApi } from "@/api/user";
import { FormError } from "@/components/forms/FormError";
import { Button } from "@/components/ui";	
import { PasswordInput } from "@/components/forms/PasswordInput";

interface ChangePasswordProps {
  onCancel: (value: boolean) => void;
}

interface PasswordData {
  current: string;
  new: string;
  confirm: string;
}

export const ChangePassword = ({ onCancel }: ChangePasswordProps) => {
  const [passwordData, setPasswordData] = useState<PasswordData>({
    current: "",
    new: "",
    confirm: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: changePassword, error: mutationError } = useMutation(
    userApi.changePassword,
    {
      onSuccess: () => {
        setPasswordData({ current: "", new: "", confirm: "" });
        onCancel(false);
      },
      onError: () => {},
    }
  );

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name])
      setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const current = passwordData.current.trim();
    const newpass = passwordData.new.trim();
    const confirm = passwordData.confirm.trim();

    if (newpass.length < 8) {
      setErrors((prev) => ({
        ...prev,
        new: "Password must be at least 8 characters",
      }));
      return;
    }

    if (current === newpass) {
      setErrors((prev) => ({
        ...prev,
        current: "New password cannot be the same as the current password",
      }));
      return;
    }

    if (newpass !== confirm) {
      setErrors((prev) => ({ ...prev, confirm: "Passwords do not match" }));
      return;
    }

    await changePassword({
      current: current,
      new: newpass,
    });
  };

  return (
    <div className="bg-muted/30 border border-border rounded-lg p-5 space-y-4 animate-in slide-in-from-top-2 fade-in duration-200">
      <form onSubmit={(e) => handleChangePassword(e)} className="space-y-4">
        <div className="space-y-2">
          <PasswordInput
            label="Current Password"
            name="current"
            value={passwordData.current}
            onChange={handlePasswordChange}
            error={errors.current}
            placeholder="Enter current password"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <PasswordInput
              label="New Password"
              name="new"
              value={passwordData.new}
              onChange={handlePasswordChange}
              error={errors.new}
              placeholder="Min. 8 characters"
              description="Must be at least 8 characters"
            />
          </div>
          <div className="space-y-2">
            <PasswordInput
              label="Confirm Password"
              name="confirm"
              value={passwordData.confirm}
              onChange={handlePasswordChange}
              error={errors.confirm}
              className={`${
                passwordData.confirm &&
                passwordData.new !== passwordData.confirm
                  ? "border-destructive focus:border-destructive focus:ring-destructive"
                  : ""
              }`}
              placeholder="Re-enter new password"
            />
          </div>
        </div>

        {mutationError && <FormError message={mutationError.message} />}

        <div className="flex items-center justify-end pt-2">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                onCancel(false);
                setPasswordData({ current: "", new: "", confirm: "" });
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="default" size="sm">
              Update Password
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
