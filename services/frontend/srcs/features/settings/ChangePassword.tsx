import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useMutation } from "@/hooks/useMutation";
import { userApi } from "@/api/user";
import { FormInput } from "@/components/forms/FormInput";
import { FormError } from "@/components/forms/FormError";
import { Button } from "@/components/ui";

interface ChangePasswordProps {
  onCancel: (value: boolean) => void;
}

export const ChangePassword = ({ onCancel }: ChangePasswordProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Error state is managed by the hook
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
          <FormInput
            label="Current Password"
            name="current"
            type={showPassword ? "text" : "password"}
            value={passwordData.current}
            onChange={handlePasswordChange}
            error={errors.current}
            placeholder="Enter current password"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <FormInput
              label="New Password"
              type={showPassword ? "text" : "password"}
              name="new"
              value={passwordData.new}
              onChange={handlePasswordChange}
              error={errors.new}
              placeholder="Min. 8 characters"
              description="Must be at least 8 characters"
            />
          </div>
          <div className="space-y-2">
            <FormInput
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              name="confirm"
              value={passwordData.confirm}
              onChange={handlePasswordChange}
              error={errors.confirm}
              className={`focus:ring-1 transition-colors ${
                passwordData.confirm &&
                passwordData.new !== passwordData.confirm
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-border focus:border-primary focus:ring-primary"
              }`}
              placeholder="Re-enter new password"
            />
          </div>
        </div>

        {mutationError && <FormError message={mutationError.message} />}

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
            {showPassword ? "Hide Passwords" : "Show Passwords"}
          </button>

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
