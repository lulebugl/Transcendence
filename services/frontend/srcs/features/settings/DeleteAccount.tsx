import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui";
import { useState } from "react";
import { useMutation } from "@/hooks/useMutation";
import { userApi } from "@/api/user";

interface DeleteAccountProps {
  onDelete: () => void;
}

export const DeleteAccount = ({ onDelete }: DeleteAccountProps) => {
  const [confirmDeletion, setConfirmDeletion] = useState(false);
  
  const { mutate: deleteAccount, isLoading: isDeleting } = useMutation(
    userApi.deleteAccount,
    {
      onSuccess: () => {
        onDelete?.();
      },
      onError: () => {
		console.error("Failed to delete account");
	  },
    }
  );

  return (
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
  );
};
