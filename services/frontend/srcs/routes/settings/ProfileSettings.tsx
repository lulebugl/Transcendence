import { BaseUserType as UserType } from "@/types";
import { FormInput } from "@/components/forms/FormInput";
import { useState } from "react";
import { useMutation } from "@/hooks/useMutation";
import { userApi } from "@/api/user";
import { SUCCESS_NOTIFICATION_DURATION } from "@/lib/constants/constants";
import { SettingsSection } from "@/components/ui/SettingsSection";
import { UserAvatar } from "@/components/UserAvatar";
import { useAuth } from "@/hooks/useAuth";
import { Mail } from "lucide-react";

export const ProfileSettings = () => {
  const { user, refreshUser } = useAuth();
  const [successField, setSuccessField] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [userInfo, setUserInfo] = useState<UserType>(user);

  const { mutate: updateUser } = useMutation(userApi.updateProfile, {
    onSuccess: () => {
      console.log("Profile updated");
	  refreshUser();
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

  const handleAvatarUploaded = (newAvatarUrl: string) => {
    setUserInfo((prev) => ({ ...prev, avatar_url: newAvatarUrl }));
    refreshUser();
  };

  return (
    <SettingsSection
      title="Your Profile"
      description="Manage how you appear to other players."
      className="space-y-8"
    >
      {/* Avatar Section */}
      <div className="flex items-center gap-6">
        <UserAvatar
          username={userInfo?.username || "User"}
          avatarUrl={userInfo?.avatar_url}
          className="w-24 h-24 rounded-full ring-4 ring-background"
          canUpload={true}
          onAvatarUploaded={handleAvatarUploaded}
        />
        <div className="space-y-2">
          <h4 className="font-medium">Profile Picture</h4>
          <p className="text-xs text-muted-foreground">
            Click on your avatar to upload a new picture. <br />
            Recommended size: 500x500px. Max size: 5MB.
          </p>
        </div>
      </div>

      <div className="space-y-6 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
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
		  <FormInput
              label="Email"
              id="email"
              defaultValue={userInfo?.email || ""}
              onBlur={(e) => handleFieldUpdate("email", e.target.value)}
              onKeyDown={handleKeyDown}
              isSuccess={successField === "email"}
              error={errors.email}
              onFocus={() => clearError("email")}
              icon={Mail}
            />
        </div>
      </div>
	  <span className="h-0.5 block"></span>
    </SettingsSection>
  );
};
