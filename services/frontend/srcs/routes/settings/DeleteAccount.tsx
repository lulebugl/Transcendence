import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui";
import { useState } from "react";
import { useMutation } from "@/hooks/useMutation";
import { userApi } from "@/api/user";
import { PasswordInput } from "@/components/forms/PasswordInput";
import { FormError } from "@/components/forms/FormError";
import { cn } from "@/lib/utils";

interface DeleteAccountProps {
  onDelete: () => void;
}

export const DeleteAccount = ({ onDelete }: DeleteAccountProps) => {
  const [confirmDeletion, setConfirmDeletion] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { mutate: deleteAccount } = useMutation(
    userApi.deleteAccount,
    {
      onSuccess: () => {
        onDelete?.();
      },
      onError: () => {},
    }
  );

  const { mutate: verifyPassword, isLoading: isVerifying } = useMutation(userApi.verifyPassword, {
    onSuccess: () => {
      deleteAccount();
    },
    onError: () => {
      setError("Invalid password");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
	if (!password.trim()) {
		setError("Password is required");
		return;
	}
	if (password.length < 8) {
		setError("Invalid credentials.");
		return;
	}
    verifyPassword(password);
  };

  return (
    <div className={cn("flex", confirmDeletion ? "flex-col gap-4" : "flex-row items-center justify-between")}>
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
        <form onSubmit={handleSubmit} className="w-full space-y-4 animate-in slide-in-from-top-2 fade-in duration-200">
          <PasswordInput
            label="Password"
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            placeholder="Enter your password"
          />

          {error && <FormError message={error} />}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setConfirmDeletion(false)}
              disabled={isVerifying}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              size="sm"
              loading={isVerifying}
            >
              Yes, Delete
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
