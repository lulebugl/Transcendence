import { useState } from "react";
import { Key, RefreshCw, Trash2 } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { SettingsSection } from "@/components/ui/SettingsSection";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { userApi } from "@/api/user";
import { useQuery } from "@/hooks/useQuery";
import { toast } from "sonner";
import { CopyButton } from "@/components/ui/CopyButton";
import { useMutation } from "@/hooks/useMutation";

export const ApiKeySettings = () => {
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    data: hasApiKeyResponse,
    isLoading,
    refetch,
  } = useQuery(userApi.hasApiKey);

  const hasApiKey = hasApiKeyResponse?.hasKey ?? false;

  const { mutate: generateApiKey, isLoading: isGenerating } = useMutation(
    userApi.generateApiKey,
    {
      onSuccess: (response) => {
        setGeneratedKey(response.apiKey);
        setIsModalOpen(true);
        refetch();
      },
      onError: () => toast.error("Failed to generate API key"),
    }
  );

  const { mutate: regenerateApiKey, isLoading: isRegenerating } = useMutation(
    userApi.regenerateApiKey,
    {
      onSuccess: (response) => {
        setGeneratedKey(response.apiKey);
        setIsModalOpen(true);
        refetch();
      },
      onError: () => toast.error("Failed to regenerate API key"),
    }
  );

  // TODO: replace by revokeApiKey
  // TODO: replace by revokeApiKey
  const { mutate: revokeApiKey, isLoading: isRevoking } = useMutation(
    userApi.deleteApiKey,
    {
      onSuccess: () => {
        toast.success("API key revoked successfully");
        refetch();
      },
      onError: () => toast.error("Failed to revoke API key"),
    }
  );

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setGeneratedKey(null);
  };

  if (isLoading) {
    return (
      <SettingsSection title="API Key" description="Manage your API keys.">
        <div className="pt-6 animate-pulse">
          <div className="h-10 bg-neutral-800 rounded-xl" />
        </div>
      </SettingsSection>
    );
  }

  return (
    <>
      <SettingsSection title="API Key" description="Manage your API keys.">
        <div className="pt-6 space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Key className="w-4 h-4" /> API Access
          </h4>

          {hasApiKey && !isModalOpen ? (
            <div className="space-y-4">
              <p className="pl-1 text-xs text-muted-foreground">
                Your API key is hidden for security. If you need to see it
                again, you must regenerate a new one.
              </p>
              <div className="flex items-center gap-3">
                <Input
                  type="text"
                  value="••••••••••••••••••••••••••••••••"
                  disabled
                  className="flex-1 font-mono"
                />
              </div>
              <div className="flex items-center gap-3 justify-end">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => regenerateApiKey()}
                  loading={isRegenerating}
                  className="min-w-0"
                >
                  <RefreshCw className="w-4 h-4" />
                  Regenerate
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => revokeApiKey()}
                  loading={isRevoking}
                  className="min-w-0"
                >
                  <Trash2 className="w-4 h-4" />
                  Revoke
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You don't have an API key yet. Generate one to access the API
                programmatically.
              </p>
              <Button
                variant="default"
                size="sm"
                onClick={() => generateApiKey()}
                loading={isGenerating}
                className="min-w-48"
              >
                Generate API Key
              </Button>
            </div>
          )}
        </div>
      </SettingsSection>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className="sm:max-w-md brightness-110"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Your API Key</DialogTitle>
            <DialogDescription>
              Make sure to copy your API key now. You won't be able to see it
              again after closing this dialog.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={generatedKey ?? ""}
              readOnly
              className="flex-1 font-mono text-xs"
            />
            <CopyButton
              className="shrink-0 min-w-0 px-3 h-10 w-10"
              text={generatedKey ?? ""}
            />
          </div>

          <DialogFooter>
            <Button variant="default" size="sm" onClick={handleCloseModal}>
              I've copied my key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
