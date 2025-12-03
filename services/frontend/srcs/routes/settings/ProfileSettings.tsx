import { User as UserType } from "@/types";
import { FormInput } from "@/components/forms/FormInput";
import { useState } from "react";
import { Camera } from "lucide-react";
import { useMutation } from "@/hooks/useMutation";
import { userApi } from "@/api/user";
import { SUCCESS_NOTIFICATION_DURATION } from "@/lib/constants";
import { Button } from "@/components/ui";
import { SettingsSection } from "@/components/ui/SettingsSection";
import { toast } from "@/components/ui/toast";

export const ProfileSettings = ({ user }: { user: UserType }) => {
  const [successField, setSuccessField] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [userInfo, setUserInfo] = useState<UserType>(user);

  const { mutate: updateUser } = useMutation(userApi.updateProfile, {
    onSuccess: () => {
      console.log("Profile updated");
    },
  });

  const clearError = (field: keyof UserType) => {
    if (!errors[field]) return;

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const handleFieldUpdate = async (field: keyof UserType, value: string) => {
    if (user[field] === value) return;

    clearError(field);

    try {
      const response = await updateUser({ [field]: value });
      setUserInfo(response);
      setSuccessField(field);
      setTimeout(() => setSuccessField(null), SUCCESS_NOTIFICATION_DURATION);
    } catch (err) {
      const error = err as Error;
      setErrors((prev) => ({ ...prev, [field]: error.message }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  return (
    <SettingsSection
      title="Public Profile"
      description="Manage how you appear to other players."
      className="space-y-8"
    >

      {/* Avatar Section */}
      <div className="flex items-center gap-6">
        <div className="relative group cursor-pointer shrink-0">
          <img
            src={userInfo?.avatar_url}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover ring-4 ring-background"
          />
          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Camera className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="font-medium">Profile Picture</h4>
          <div className="flex gap-3">
            <Button
              variant="primary"
              size="sm"
              className="text-xs px-4 py-2 hover:bg-primary/90"
            >
              Upload New
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs px-4 py-2 hover:bg-accent"
			  onClick={() => {
				toast.error("Not implemented");
			  }}
            >
              Remove
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Recommended size: 500x500px. Max size: 2MB.
          </p>
        </div>
      </div>

      <div className="space-y-6 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <FormInput
              label="Username"
              id="username"
              defaultValue={userInfo?.username}
              onBlur={(e) => handleFieldUpdate("username", e.target.value)}
              onKeyDown={handleKeyDown}
              isSuccess={successField === "username"}
              error={errors.username}
              onFocus={() => clearError("username")}
            />
          </div>
        </div>
      </div>
    </SettingsSection>
  );
};
