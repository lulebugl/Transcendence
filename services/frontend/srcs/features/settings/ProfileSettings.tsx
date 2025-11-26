import { User as UserType } from "@/types";
import { FormInput } from "@/components/FormInput";
import { useState } from "react";
import { Camera } from "lucide-react";
import { useMutation } from "@/hooks/useMutation";
import { useAuth } from "@/context/auth-context";
import { userApi } from "@/api/user";
import { SUCCESS_NOTIFICATION_DURATION } from "@/lib/constants";

export const ProfileSettings = ({ user }: { user: UserType }) => {
  const { refreshUser } = useAuth();
  const [successField, setSuccessField] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      await updateUser({ [field]: value });
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
    <div className="space-y-8">
      <div className="pb-6 border-b border-border">
        <h3 className="text-lg font-bold mb-1">Public Profile</h3>
        <p className="text-sm text-muted-foreground">
          Manage how you appear to other players.
        </p>
      </div>

      {/* Avatar Section */}
      <div className="flex items-center gap-6">
        <div className="relative group cursor-pointer shrink-0">
          <img
            src={user?.avatar_url}
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
            <button className="text-xs bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
              Upload New
            </button>
            <button className="text-xs border border-border px-4 py-2 rounded-lg hover:bg-accent transition-colors">
              Remove
            </button>
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
              defaultValue={user?.username}
              onBlur={(e) => handleFieldUpdate("username", e.target.value)}
              onKeyDown={handleKeyDown}
              isSuccess={successField === "username"}
              error={errors.username}
              onFocus={() => clearError("username")}
            />
          </div>
          <div className="space-y-2">
            <FormInput
              label="Display Name"
              id="display-name"
              defaultValue={user?.username}
              onBlur={(e) => handleFieldUpdate("email", e.target.value)}
              onKeyDown={handleKeyDown}
              isSuccess={successField === "email"}
              error={errors.email}
              onFocus={() => clearError("email")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Bio</label>
          <textarea
            rows={4}
            defaultValue="Just a simple paddle in a complex digital world. chasing the perfect bounce."
            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
          />
          <p className="text-xs text-muted-foreground text-right">
            120/500 characters
          </p>
        </div>
      </div>
    </div>
  );
};
